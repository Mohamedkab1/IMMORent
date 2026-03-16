<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\RentalRequestController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes des biens (publiques)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Routes protégées
Route::middleware(['auth:sanctum', 'check.status'])->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // Properties (gestion)
    Route::middleware(['agent'])->group(function () {
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{id}', [PropertyController::class, 'update']);
        Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
        Route::post('/properties/{id}/images', [PropertyController::class, 'uploadImages']);
        Route::get('/my/properties', [PropertyController::class, 'myProperties']);
    });
    
    // Rental Requests
    Route::get('/my/requests', [RentalRequestController::class, 'myRequests']);
    Route::post('/requests', [RentalRequestController::class, 'store']);
    Route::get('/requests/{id}', [RentalRequestController::class, 'show']);
    
    Route::middleware(['agent'])->group(function () {
        Route::get('/requests', [RentalRequestController::class, 'index']);
        Route::put('/requests/{id}/process', [RentalRequestController::class, 'process']);
    });
    
    // Contracts
    Route::get('/my/contracts', [ContractController::class, 'myContracts']);
    
    Route::middleware(['agent'])->group(function () {
        Route::post('/contracts', [ContractController::class, 'store']);
        Route::get('/contracts/{id}', [ContractController::class, 'show']);
        Route::put('/contracts/{id}/status', [ContractController::class, 'updateStatus']);
    });
    
    // Payments
    Route::get('/my/payments', [PaymentController::class, 'myPayments']);
    Route::post('/payments', [PaymentController::class, 'store']);
    
    // Admin routes
    Route::middleware(['admin'])->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::post('/admin/users', [UserController::class, 'store']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
        Route::put('/admin/users/{id}/status', [UserController::class, 'toggleStatus']);
        
        Route::get('/admin/stats', [DashboardController::class, 'adminStats']);
    });
});