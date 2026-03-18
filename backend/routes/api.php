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
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats'])->middleware('admin');
    
    // ========== UTILISATEURS ==========
    Route::get('/users', [UserController::class, 'index'])->middleware('admin');
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('admin');
    Route::put('/users/{id}/status', [UserController::class, 'toggleStatus'])->middleware('admin');
    
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
    // Routes pour les clients
    Route::get('/my/contracts', [ContractController::class, 'myContracts']);
    
    // Routes pour les agents et admin
    Route::middleware(['agent'])->group(function () {
        Route::get('/contracts', [ContractController::class, 'index']);
        Route::post('/contracts', [ContractController::class, 'store']);
        Route::get('/contracts/{id}', [ContractController::class, 'show']);
        Route::put('/contracts/{id}', [ContractController::class, 'update']);
        Route::put('/contracts/{id}/status', [ContractController::class, 'updateStatus']);
        Route::delete('/contracts/{id}', [ContractController::class, 'destroy'])->middleware('admin');
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
// ROUTES ADMIN (Accès restreint aux administrateurs)
// ===========================================
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Statistiques avancées
    Route::get('/stats', [DashboardController::class, 'adminStats']);
    
    // Gestion complète des utilisateurs
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}/status', [UserController::class, 'toggleStatus']);
    
    // Gestion des rôles
    Route::get('/roles', [UserController::class, 'roles']);
    Route::post('/roles', [UserController::class, 'createRole']);
    Route::put('/roles/{id}', [UserController::class, 'updateRole']);
    Route::delete('/roles/{id}', [UserController::class, 'deleteRole']);
    
    // Supervision des biens
    Route::get('/all-properties', [PropertyController::class, 'adminIndex']);
    Route::put('/properties/{id}/verify', [PropertyController::class, 'verify']);
    
    // Supervision des contrats
    Route::get('/all-contracts', [ContractController::class, 'adminIndex']);
    
    // Logs et activités
    Route::get('/logs', [DashboardController::class, 'logs']);
});

// ===========================================
// ROUTES DE TEST (À supprimer en production)
// ===========================================
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working!',
        'timestamp' => now()->toDateTimeString()
    ]);
});