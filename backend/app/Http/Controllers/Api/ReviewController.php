<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Property;
use App\Models\RentalRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of approved reviews for a property.
     */
    public function index($propertyId)
    {
        $reviews = Review::with('user:id,name,profile_photo')
            ->where('property_id', $propertyId)
            ->approved()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'property_id' => 'required|exists:properties,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:5|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = Auth::id();
        $propertyId = $request->property_id;

        // 1. Restriction: Check if the user has made a request for this property
        $hasRequest = RentalRequest::where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->exists();

        if (!$hasRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Vous devez avoir effectué une demande pour ce bien avant de pouvoir laisser un avis.'
            ], 403);
        }

        // 2. Check if user already reviewed this property
        $alreadyReviewed = Review::where('user_id', $userId)
            ->where('property_id', $propertyId)
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà laissé un avis pour ce bien.'
            ], 400);
        }

        // 3. Create review with 'pending' status for moderation
        $review = Review::create([
            'user_id' => $userId,
            'property_id' => $propertyId,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre avis a été soumis et est en attente de modération.',
            'data' => $review
        ], 201);
    }

    /**
     * Admin: Update review status (approve/reject).
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Avis non trouvé.'
            ], 404);
        }

        $review->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => "L'avis a été " . ($request->status === 'approved' ? 'approuvé' : 'rejeté') . ".",
            'data' => $review
        ]);
    }

    /**
     * Admin: List all pending reviews.
     */
    public function pendingReviews()
    {
        $reviews = Review::with(['user', 'property'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }
}
