<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    /**
     * Get all approved reviews for a property.
     */
    public function index(Request $request, $propertyId)
    {
        try {
            $property = Property::findOrFail($propertyId);
            $user = $request->user('sanctum');
            
            // Only approved reviews for public display
            $reviews = $property->reviews()
                ->where('status', 'approved')
                ->with('user:id,name,profile_photo')
                ->orderBy('created_at', 'desc')
                ->get();

            $userReview = null;
            if ($user) {
                $userReview = Review::where('property_id', $propertyId)
                    ->where('user_id', $user->id)
                    ->first();
            }

            $averageRating = $property->reviews()->where('status', 'approved')->avg('rating') ?: 0;
            $totalReviews = $property->reviews()->where('status', 'approved')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'reviews' => $reviews,
                    'user_review' => $userReview,
                    'average_rating' => round($averageRating, 1),
                    'total_reviews' => $totalReviews
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des avis',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit a review for a property (pending by default).
     */
    public function store(Request $request, $propertyId)
    {
        try {
            $user = $request->user();
            $property = Property::findOrFail($propertyId);

            // Validation
            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|between:1,5',
                'comment' => 'required|string|min:5|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Business Rule: Cannot review your own property
            if ($property->user_id === $user->id || $property->owner_id === $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas laisser un avis sur votre propre bien.'
                ], 403);
            }

            // Business Rule: One review per user per property
            $existingReview = Review::where('user_id', $user->id)
                ->where('property_id', $propertyId)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous avez déjà laissé un avis pour ce bien.'
                ], 400);
            }

            // Create Review (status defaults to pending)
            $review = Review::create([
                'property_id' => $propertyId,
                'user_id' => $user->id,
                'rating' => $request->rating,
                'comment' => $request->comment,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Merci ! Votre avis est en attente de modération par l\'agent.',
                'data' => $review->load('user:id,name,profile_photo')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la publication de l\'avis',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending reviews for the current agent's properties.
     */
    public function agentReviews(Request $request)
    {
        try {
            $user = $request->user();
            
            // Get reviews for properties owned by this agent
            $reviews = Review::with(['user:id,name,profile_photo', 'property:id,title'])
                ->whereHas('property', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->where('status', 'pending')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reviews
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des avis à moderer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process a review (Approve/Reject) by the agent.
     */
    public function process(Request $request, $id)
    {
        try {
            $user = $request->user();
            $review = Review::with('property')->findOrFail($id);

            // Check if user is the agent of the property
            if ($review->property->user_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé à moderer cet avis.'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:approved,rejected'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Status invalide',
                    'errors' => $validator->errors()
                ], 422);
            }

            $review->update([
                'status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => $request->status === 'approved' ? 'Avis approuvé !' : 'Avis refusé.',
                'data' => $review
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement de l\'avis',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
