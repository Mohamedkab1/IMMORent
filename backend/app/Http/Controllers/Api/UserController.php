<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of users (Admin only).
     */
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $query = User::with('role');

        // Filtre par rôle
        if ($request->has('role') && !empty($request->role)) {
            $query->whereHas('role', function($q) use ($request) {
                $q->where('slug', $request->role);
            });
        }

        // Filtre par statut (actif/inactif)
        if ($request->has('status') && $request->status !== '') {
            $query->where('is_active', $request->status === 'active' || $request->status === '1');
        }

        // Recherche par nom ou email
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Tri
        $sortField = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $allowedSorts = ['name', 'email', 'created_at'];
        
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortOrder);
        } else {
            $query->latest();
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Store a newly created user in storage (Admin only).
     */
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,slug',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $role = Role::where('slug', $request->role)->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $role->id,
            'phone' => $request->phone,
            'address' => $request->address,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur créé avec succès',
            'data' => $user->load('role')
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::with('role')->find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        // Only the user themselves or an admin can update
        if ($request->user()->id !== $user->id && !$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password' => 'sometimes|nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->except(['profile_photo', 'password', 'role_id']);

        if ($request->has('password') && !empty($request->password)) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('profile_photo')) {
            // Delete old photo if exists
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $path = $request->file('profile_photo')->store('profiles', 'public');
            $data['profile_photo'] = $path;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data' => $user->fresh('role')
        ]);
    }

    /**
     * Activate/Deactivate user (Admin only).
     */
    public function toggleStatus(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        if ($user->id === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Vous ne pouvez pas désactiver votre propre compte'], 400);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => $user->is_active ? 'Utilisateur activé' : 'Utilisateur désactivé',
            'data' => $user
        ]);
    }

    /**
     * Remove the specified user (Admin only).
     */
    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        if ($user->id === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Vous ne pouvez pas supprimer votre propre compte'], 400);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }

    /**
     * Request to become an agent (Client only).
     */
    public function requestAgentRole(Request $request)
    {
        $user = $request->user();

        if ($user->isAgent() || $user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Vous avez déjà un rôle privilégié'], 400);
        }

        if ($user->agent_status === 'pending') {
            return response()->json(['success' => false, 'message' => 'Une demande est déjà en cours'], 400);
        }

        $user->agent_status = 'pending';
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Votre demande pour devenir agent a été envoyée',
            'data' => $user
        ]);
    }

    /**
     * Get pending agent requests (Admin only).
     */
    public function getPendingAgents(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $users = User::where('agent_status', 'pending')->with('role')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Approve or reject an agent request (Admin only).
     */
    public function adminProcessAgentRequest(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $status = $request->status;
        $user->agent_status = $status;

        if ($status === 'approved') {
            $agentRole = Role::where('slug', 'agent')->first();
            if ($agentRole) {
                $user->role_id = $agentRole->id;
                $user->is_active = true;
            }
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => $status === 'approved' ? 'Demande approuvée avec succès' : 'Demande refusée',
            'data' => $user->load('role')
        ]);
    }
}
