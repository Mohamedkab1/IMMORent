<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\RentalRequestController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TestPdfController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\Api\AIController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ===========================================
// ROUTES PUBLIQUES (Accessibles sans authentification)
// ===========================================

// Authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/forgot', [AuthController::class, 'forgotPassword']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);

// Biens immobiliers (consultation publique)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::get('/properties/{id}/reviews', [ReviewController::class, 'index']);

// AI Assistant
Route::post('/ai/chat', [AIController::class, 'chat']);


// Catégories de biens
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// Route de test public
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toDateTimeString()
    ]);
});

// Route de test PDF
Route::get('/test-pdf', function() {
    try {
        $pdf = Barryvdh\DomPDF\Facade\Pdf::loadHTML('<h1>Test PDF</h1><p>Ceci est un test de génération de PDF</p><p>Date: ' . date('d/m/Y H:i:s') . '</p>');
        return $pdf->download('test.pdf');
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la génération du PDF',
            'error' => $e->getMessage()
        ], 500);
    }
});

// ===========================================
// ROUTES PROTÉGÉES (Nécessitent une authentification)
// ===========================================
Route::middleware('auth:sanctum')->group(function () {
    // Route de test pour le broadcast
    Route::get('/test-broadcast', function () {
        $user = auth()->user();
        event(new \App\Events\RealTimeNotification($user->id, [
            'title' => 'Test Real-time',
            'message' => 'Ceci est une notification de test ' . now()->toTimeString(),
            'type' => 'info',
            'icon' => 'bell'
        ]));
        return response()->json(['message' => 'Broadcast sent to user ' . $user->id]);
    });
    
    // ========== AUTHENTIFICATION ==========
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    
    // ========== TABLEAUX DE BORD ==========
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // ========== FAVORIS ==========
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);
    
    // ========== UTILISATEURS ==========
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    
    // Routes admin
    Route::middleware(['admin'])->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::put('/users/{id}/status', [UserController::class, 'toggleStatus']);
        Route::get('/admin/stats', [DashboardController::class, 'adminStats']);
        Route::get('/admin/logs', [DashboardController::class, 'logs']);
        
        // Agent validation routes
        Route::get('/admin/agent-requests', [UserController::class, 'getPendingAgents']);
        Route::put('/admin/agent-requests/{id}/process', [UserController::class, 'adminProcessAgentRequest']);

        // Property Admin
        Route::get('/admin/properties', [PropertyController::class, 'adminIndex']);
        Route::put('/admin/properties/{id}/approve', [PropertyController::class, 'approve']);
        Route::put('/admin/properties/{id}/reject', [PropertyController::class, 'reject']);
        Route::put('/admin/properties/{id}/archive', [PropertyController::class, 'toggleArchive']);
        Route::put('/admin/properties/{id}/featured', [PropertyController::class, 'toggleFeatured']);
        Route::post('/admin/properties/geocode-existing', [PropertyController::class, 'geocodeExisting']);

        // Settings
        Route::get('/admin/settings', [SettingController::class, 'index']);
        Route::put('/admin/settings/bulk', [SettingController::class, 'updateBulk']);
    });

    // ========== PROFIL ET RÔLES ==========
    Route::post('/me/become-agent', [UserController::class, 'requestAgentRole']);
    
    // ========== PROPRIÉTÉS (Gestion) ==========
    // Routes pour les agents et admin
    Route::middleware(['agent'])->group(function () {
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{id}', [PropertyController::class, 'update']);
        Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
        Route::post('/properties/{id}/images', [PropertyController::class, 'uploadImages']);
        Route::delete('/properties/{id}/images/{index}', [PropertyController::class, 'deleteImage']);
        Route::get('/my/properties', [PropertyController::class, 'myProperties']);
    });
    
    // ========== AVIS ==========
    Route::post('/properties/{id}/reviews', [ReviewController::class, 'store']);
    
    // Modération des avis (Agents)
    Route::middleware(['agent'])->group(function () {
        Route::get('/agent/reviews', [ReviewController::class, 'agentReviews']);
        Route::put('/reviews/{id}/process', [ReviewController::class, 'process']);
    });
    
    // ========== DEMANDES DE LOCATION ==========
    // Routes pour les clients
    Route::get('/my/requests', [RentalRequestController::class, 'myRequests']);
    Route::post('/requests', [RentalRequestController::class, 'store']);
    Route::get('/requests/{id}', [RentalRequestController::class, 'show']);
    Route::delete('/requests/{id}', [RentalRequestController::class, 'cancel']);
    
    // Routes pour les agents et admin
    Route::middleware(['agent'])->group(function () {
        Route::get('/requests', [RentalRequestController::class, 'index']);
        Route::put('/requests/{id}/process', [RentalRequestController::class, 'process']);
        Route::get('/properties/{id}/requests', [RentalRequestController::class, 'propertyRequests']);
        Route::get('/requests/stats', [RentalRequestController::class, 'stats']);
    });
    
    // ========== CONTRATS ==========
    // Routes pour tous les utilisateurs authentifiés
    Route::get('/contracts', [ContractController::class, 'index']);
    Route::get('/contracts/{id}', [ContractController::class, 'show']);
    Route::get('/my/contracts', [ContractController::class, 'myContracts']);
    
    // Route de téléchargement PDF
    Route::get('/contracts/{id}/download', [ContractController::class, 'download']);
    
    // Routes pour les agents et admin
    Route::middleware(['agent'])->group(function () {
        Route::post('/contracts', [ContractController::class, 'store']);
        Route::put('/contracts/{id}/status', [ContractController::class, 'updateStatus']);
        Route::get('/agent/contracts', [ContractController::class, 'agentContracts']);
    });
    
    // Routes admin uniquement
    Route::middleware(['admin'])->group(function () {
        Route::delete('/contracts/{id}', [ContractController::class, 'destroy']);
        Route::get('/admin/contracts', [ContractController::class, 'adminIndex']);
    });
    
    // ========== PAIEMENTS ==========
    // Routes pour les clients
    Route::get('/my/payments', [PaymentController::class, 'myPayments']);
    Route::post('/payments/create-intent', [PaymentController::class, 'createIntent']);
    Route::post('/payments/confirm', [PaymentController::class, 'confirm']);
    
    // ========== FACTURES ==========
    Route::get('/invoices/{id}/download', [InvoiceController::class, 'download']);
    
    // Routes pour les agents et admin
    Route::middleware(['agent'])->group(function () {
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/{id}', [PaymentController::class, 'show']);
        Route::put('/payments/{id}/status', [PaymentController::class, 'updateStatus']);
    });
    
    // Routes admin uniquement
    Route::middleware(['admin'])->group(function () {
        Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
    });
    // ========== NOTIFICATIONS ==========
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // ========== MESSAGERIE ==========
    Route::get('/conversations', [MessageController::class, 'index']);
    Route::get('/conversations/{id}', [MessageController::class, 'show']);
    Route::post('/messages', [MessageController::class, 'store']);

});

// ===========================================
// ROUTES DE TEST (Pour débogage)
// ===========================================
Route::middleware('auth:sanctum')->get('/test', function (Illuminate\Http\Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'API is working!',
        'user' => [
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'role' => $request->user()->role->slug ?? 'unknown'
        ]
    ]);
});

// ===========================================
// ROUTES DE TEST POUR CONTRAT PDF
// ===========================================
Route::middleware('auth:sanctum')->get('/test-pdf-contract/{id}', [TestPdfController::class, 'downloadContract']);