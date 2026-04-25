<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\RentalRequest;
use App\Models\Contract;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get stats for the current user's role.
     */
    public function stats(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            // Safe role check without eager loading to avoid errors
            $roleSlug = $user->role?->slug ?? ($user->role_id ? \App\Models\Role::find($user->role_id)?->slug : 'client');

            if ($roleSlug === 'admin') {
                return $this->getAdminStats();
            }

            if ($roleSlug === 'agent') {
                return $this->getAgentStats($user);
            }

            return $this->getClientStats($user);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
                'file' => basename($e->getFile()),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Global stats for Admin.
     */
    private function getAdminStats()
    {
        try {
            // Using direct queries instead of whereHas to avoid potential issues
            $clientRole = \App\Models\Role::where('slug', 'client')->first();
            $agentRole = \App\Models\Role::where('slug', 'agent')->first();

            $stats = [
                'properties' => [
                    'total' => Property::count(),
                    'available' => Property::where('status', 'available')->count(),
                    'rented' => Property::where('status', 'rented')->count(),
                    'sold' => Property::where('status', 'sold')->count(),
                ],
                'users' => [
                    'total' => User::count(),
                    'clients' => $clientRole ? User::where('role_id', $clientRole->id)->count() : 0,
                    'agents' => $agentRole ? User::where('role_id', $agentRole->id)->count() : 0,
                ],
                'requests' => [
                    'total' => RentalRequest::count(),
                    'pending' => RentalRequest::where('status', 'pending')->count(),
                ],
                'contracts' => [
                    'active' => Contract::where('status', 'active')->count(),
                ],
                'revenue' => [
                    'total' => (float) Payment::where('status', 'paid')->sum('amount'),
                    'monthly' => $this->getMonthlyRevenue(),
                ],
                'charts' => [
                    'properties_by_type' => $this->getPropertiesByType(),
                    'registrations_by_month' => $this->getMonthlyRegistrations(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Admin stats error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Stats for Agent.
     */
    private function getAgentStats($user)
    {
        $stats = [
            'my_properties' => [
                'total' => Property::where('user_id', $user->id)->count(),
                'available' => Property::where('user_id', $user->id)->where('status', 'available')->count(),
                'rented' => Property::where('user_id', $user->id)->where('status', 'rented')->count(),
                'sold' => Property::where('user_id', $user->id)->where('status', 'sold')->count(),
            ],
            'requests' => [
                'received' => RentalRequest::whereHas('property', fn($q) => $q->where('user_id', $user->id))->count(),
                'pending' => RentalRequest::where('status', 'pending')
                    ->whereHas('property', fn($q) => $q->where('user_id', $user->id))->count(),
            ],
            'contracts' => [
                'managed' => Contract::where('agent_id', $user->id)->where('status', 'active')->count(),
            ],
            'revenue_managed' => (float) Contract::where('agent_id', $user->id)
                ->where('status', 'active')
                ->where('contract_type', 'rent')
                ->select(DB::raw('SUM(monthly_rent + COALESCE(charges, 0)) as total'))
                ->value('total') ?? 0,
            'sales_managed' => [
                'total_value' => (float) Contract::where('agent_id', $user->id)
                    ->where('contract_type', 'sale')
                    ->sum('sale_price'),
                'count' => Contract::where('agent_id', $user->id)
                    ->where('contract_type', 'sale')
                    ->count(),
            ],
            'charts' => [
                'requests_by_month' => $this->getMonthlyRequestsForAgent($user),
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Stats for Client.
     */
    private function getClientStats($user)
    {
        $stats = [
            'my_requests' => [
                'total' => RentalRequest::where('user_id', $user->id)->count(),
                'approved' => RentalRequest::where('user_id', $user->id)->where('status', 'approved')->count(),
            ],
            'my_contracts' => Contract::where('tenant_id', $user->id)
                ->orWhere('buyer_id', $user->id)
                ->count(),
            'total_spent' => Payment::where('user_id', $user->id)->where('status', 'paid')->sum('amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    private function getMonthlyRevenue()
    {
        try {
            $months = [];
            // Retrieve data for the last 12 months
            for ($i = 11; $i >= 0; $i--) {
                $date = \Carbon\Carbon::now()->subMonths($i);
                $months[$date->format('Y-m')] = [
                    'month' => $date->format('n'), // n returns numeric month without leading zero (1-12)
                    'total' => 0
                ];
            }

            // Fetch paid payments from the last 12 months
            $payments = \App\Models\Payment::where('status', 'paid')
                ->where('created_at', '>=', \Carbon\Carbon::now()->subMonths(11)->startOfMonth())
                ->get()
                ->groupBy(function($val) {
                    return \Carbon\Carbon::parse($val->created_at)->format('Y-m');
                });

            // Sum amounts for each month
            foreach ($payments as $monthYear => $monthPayments) {
                if (isset($months[$monthYear])) {
                    $months[$monthYear]['total'] = $monthPayments->sum('amount');
                }
            }

            return array_values($months);
        } catch (\Exception $e) {
            return [];
        }
    }

    private function getPropertiesByType()
    {
        try {
            return [];
        } catch (\Exception $e) {
            return [];
        }
    }

    private function getMonthlyRegistrations()
    {
        try {
            return [];
        } catch (\Exception $e) {
            return [];
        }
    }

    private function getMonthlyRequestsForAgent($user)
    {
        try {
            return [];
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Admin stats - separate endpoint.
     */
    public function adminStats()
    {
        return $this->getAdminStats();
    }

    /**
     * Logs - admin only.
     */
    public function logs()
    {
        return response()->json([
            'success' => true,
            'data' => []
        ]);
    }
}
