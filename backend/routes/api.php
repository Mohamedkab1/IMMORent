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
use App\Http\Controllers\Api\TestController;

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

// Biens immobiliers (consultation publique)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Catégories de biens
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// ===========================================
// ROUTES PROTÉGÉES (Nécessitent une authentification)
// ===========================================
Route::middleware('auth:sanctum')->group(function () {
    
    // ========== AUTHENTIFICATION ==========
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // ========== TABLEAUX DE BORD ==========
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // ========== UTILISATEURS ==========
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    
    // Routes admin
    Route::middleware(['admin'])->group(function () {
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::put('/users/{id}/status', [UserController::class, 'toggleStatus']);
        Route::get('/admin/stats', [DashboardController::class, 'adminStats']);
        Route::get('/admin/logs', [DashboardController::class, 'logs']);
    });
    
    // ========== PROPRIÉTÉS (Gestion) ==========
    // Routes pour les agents et admin
    Route::middleware(['agent'])->group(function () {
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{id}', [PropertyController::class, 'update']);
        Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
        Route::post('/properties/{id}/images', [PropertyController::class, 'uploadImages']);
        Route::get('/my/properties', [PropertyController::class, 'myProperties']);
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
    });
    
    // ========== CONTRATS ==========
    // Routes publiques pour tous les utilisateurs authentifiés
    Route::get('/contracts', [ContractController::class, 'index']);
    Route::get('/contracts/{id}', [ContractController::class, 'show']);
    Route::get('/my/contracts', [ContractController::class, 'myContracts']);
    
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
    
    // Routes pour les agents et admin
    Route::middleware(['agent'])->group(function () {
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/{id}', [PaymentController::class, 'show']);
        Route::put('/payments/{id}/status', [PaymentController::class, 'updateStatus']);
    });
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

// Route de test public
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toDateTimeString()
    ]);
});