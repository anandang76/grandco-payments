<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\AuthController;
use App\Http\Controllers\CoreController;
use App\Http\Controllers\SaleController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::any('health_check', [CoreController::class, 'healthCheck'])->name('healthCheck');

Route::prefix('auth')->group(function () {
    Route::any('login', [AuthController::class, 'login'])->name('login');
});


Route::middleware(['jwt.verify'])->group(function () {
    
    Route::prefix('sale')->group(function () {
        Route::any('list/{id}', [SaleController::class, 'listTransactions'])->name('listTransactions');
        Route::any('add', [SaleController::class, 'addTransactions'])->name('addTransactions');
        Route::any('update/{id}', [SaleController::class, 'updateTransactions'])->name('updateTransactions');
    });

});