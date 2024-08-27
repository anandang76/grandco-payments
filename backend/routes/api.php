<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DeviceConfigController;
use App\Http\Controllers\DeviceManagementController;
use App\Http\Controllers\EmailConfigController;
use App\Http\Controllers\ConfigDeviceController;
use App\Http\Controllers\DeviceModeController;
use App\Http\Controllers\TransactionsController;



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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix('auth')->group(function () {
    Route::post('/register', [LoginController::class, 'register'])->name('register');
    Route::post('/login', [LoginController::class, 'login'])->name('login');
    Route::post('/forgotPassword', [LoginController::class, 'forgotPassword'])->name('forgotPassword');
    Route::post('/reset_password/{token?}', [LoginController::class, 'reset_password'])->name('reset_password');
    Route::post('/otp_login', [LoginController::class, 'otp_login'])->name('otp_login');
    Route::post('/otp_login_verify', [LoginController::class, 'otp_login_verify'])->name('otp_login_verify');
    Route::post('logout', [LoginController::class, 'logout'])->name('logout');
});

Route::middleware(['verifyJWT'])->group(function () {
    Route::prefix('info')->group(function () {
        Route::post('getInfo', [DataController::class, 'getInfo'])->name('getInfo');
        Route::post('alerts', [DataController::class, 'getAlerts'])->name('getAlerts');
        // Route::post('alertCurrentStatus', [DataController::class, 'alertCurrentStatus'])->name('alertCurrentStatus');
        // Route::post('alertUserClear', [DataController::class, 'alertUserClear'])->name('alertUserClear');
        Route::prefix('alerts')->group(function () {
            Route::post('currentStatus', [DataController::class, 'alertCurrentStatus'])->name('alertCurrentStatusNew');
            Route::post('userClear', [DataController::class, 'alertUserClear'])->name('alertUserClearNew');
        });
    });

    Route::prefix('page')->group(function () {
        Route::post('dashboard', [DataController::class, 'dashboard'])->name('dashboard');
        Route::post('device', [DataController::class, 'getDeviceDetails'])->name('getDeviceDetails');
        Route::post('sensor', [DataController::class, 'getSensorDetails'])->name('getSensorDetails');
        Route::post('sensorGraph', [DataController::class, 'getSensorGraphDetails'])->name('getSensorGraphDetails');
        Route::post('aqiGraph', [DataController::class, 'getAqiGraphDetails'])->name('getAqiGraphDetails');
    });

    Route::prefix('users')->group(function () {
        Route::post('/', [UsersController::class, 'getAllUsers'])->name('getAllUsers');
        Route::post('get/{id}', [UsersController::class, 'getUser'])->name('getUser');
        Route::post('add', [UsersController::class, 'addUser'])->name('addUser');
        Route::post('edit/{id}', [UsersController::class, 'editUser'])->name('editUser');
        Route::post('delete/{id}', [UsersController::class, 'deleteUser'])->name('deleteUser');

        Route::post('changePassword', [UsersController::class, 'changePassword'])->name('changePassword');
        Route::post('resetPassword', [UsersController::class, 'resetPassword'])->name('resetPassword');
    });

    Route::prefix('reports')->group(function () {
        Route::post('sensorReport', [ReportController::class, 'sensorReport'])->name('sensorReport');
        Route::post('aqiReport', [ReportController::class, 'aqiReport'])->name('aqiReport');
        Route::post('alarmReport', [ReportController::class, 'alarmReport'])->name('alarmReport');
        Route::post('serverUtilizationReport', [ReportController::class, 'serverUtilizationReport'])->name('serverUtilizationReport');
        Route::post('applicationVersionReport', [ReportController::class, 'applicationVersionReport'])->name('applicationVersionReport');
        Route::post('firmwareVersionReport', [ReportController::class, 'firmwareVersionReport'])->name('firmwareVersionReport');
        Route::prefix('bumpTestReport')->group(function () {
            Route::post('get', [ReportController::class, 'getBumpTestReport'])->name('getBumpTestReport');
            Route::post('add', [ReportController::class, 'addBumpTestReport'])->name('addBumpTestReport');
        });
        Route::prefix('calibrationReport')->group(function () {
            Route::post('get', [ReportController::class, 'getCalibrationReport'])->name('getCalibrationReport');
            Route::post('add', [ReportController::class, 'addCalibrationReport'])->name('addCalibrationReport');
        });
        Route::post('userLogReport', [ReportController::class, 'userLogReport'])->name('userLogReport');
        Route::post('limitEditLogsReport/{id}', [ReportController::class, 'limitEditLogsReport'])->name('limitEditLogsReport');
        Route::post('eventLogReport', [ReportController::class, 'eventLogReport'])->name('eventLogReport');
    });

    Route::prefix('deviceConfig')->group(function () {
        Route::prefix('location')->group(function () {
            Route::post('get/{id}', [DeviceConfigController::class, 'getConfigLocation'])->name('getConfigLocation');
            Route::post('add', [DeviceConfigController::class, 'addConfigLocation'])->name('addConfigLocation');
            Route::post('edit/{id}', [DeviceConfigController::class, 'editConfigLocation'])->name('editConfigLocation');
            Route::post('delete/{id}', [DeviceConfigController::class, 'deleteConfigLocation'])->name('deleteConfigLocation');
        });

        Route::prefix('branch')->group(function () {
            Route::post('get/{id}', [DeviceConfigController::class, 'getConfigBranch'])->name('getConfigBranch');
            Route::post('add', [DeviceConfigController::class, 'addConfigBranch'])->name('addConfigBranch');
            Route::post('edit/{id}', [DeviceConfigController::class, 'editConfigBranch'])->name('editConfigBranch');
            Route::post('delete/{id}', [DeviceConfigController::class, 'deleteConfigBranch'])->name('deleteConfigBranch');
        });

        Route::prefix('facility')->group(function () {
            Route::post('get/{id}', [DeviceConfigController::class, 'getConfigFacility'])->name('getConfigFacility');
            Route::post('add', [DeviceConfigController::class, 'addConfigFacility'])->name('addConfigFacility');
            Route::post('edit/{id}', [DeviceConfigController::class, 'editConfigFacility'])->name('editConfigFacility');
            Route::post('delete/{id}', [DeviceConfigController::class, 'deleteConfigFacility'])->name('deleteConfigFacility');
        });

        Route::prefix('building')->group(function () {
            Route::post('get/{id}', [DeviceConfigController::class, 'getConfigBuilding'])->name('getConfigBuilding');
            Route::post('add', [DeviceConfigController::class, 'addConfigBuilding'])->name('addConfigBuilding');
            Route::post('edit/{id}', [DeviceConfigController::class, 'editConfigBuilding'])->name('editConfigBuilding');
            Route::post('delete/{id}', [DeviceConfigController::class, 'deleteConfigBuilding'])->name('deleteConfigBuilding');
        });

        Route::prefix('floor')->group(function () {
            Route::post('get/{id}', [DeviceConfigController::class, 'getConfigFloor'])->name('getConfigFloor');
            Route::post('add', [DeviceConfigController::class, 'addConfigFloor'])->name('addConfigFloor');
            Route::post('edit/{id}', [DeviceConfigController::class, 'editConfigFloor'])->name('editConfigFloor');
            Route::post('delete/{id}', [DeviceConfigController::class, 'deleteConfigFloor'])->name('deleteConfigFloor');
        });

        Route::prefix('zone')->group(function () {
            Route::post('all', [DeviceConfigController::class, 'getAllZone'])->name('getAllZone');
            Route::post('get/{id}', [DeviceConfigController::class, 'getConfigZone'])->name('getConfigZone');
            Route::post('add', [DeviceConfigController::class, 'addConfigZone'])->name('addConfigZone');
            Route::post('edit/{id}', [DeviceConfigController::class, 'editConfigZone'])->name('editConfigZone');
            Route::post('delete/{id}', [DeviceConfigController::class, 'deleteConfigZone'])->name('deleteConfigZone');
        });

        Route::prefix('device')->group(function () {
            Route::post('all', [DeviceConfigController::class, 'getAllDevice'])->name('getAllDevice');
            Route::post('get/{id}', [DeviceConfigController::class, 'getConfigDevice'])->name('getConfigDevice');
            Route::post('add', [DeviceConfigController::class, 'addConfigDevice'])->name('addConfigDevice');
            Route::post('edit/{id}', [DeviceConfigController::class, 'editConfigDevice'])->name('editConfigDevice');
            Route::post('binFile/{id}', [DeviceConfigController::class, 'editConfigDeviceBinFile'])->name('editConfigDeviceBinFile');
            Route::post('changeMode/{id}', [DeviceConfigController::class, 'changeModeConfigDevice'])->name('changeModeConfigDevice');
            Route::post('delete/{id}', [DeviceConfigController::class, 'deleteConfigDevice'])->name('deleteConfigDevice');
            Route::post('copy/{id}', [DeviceConfigController::class, 'copyConfigDevice'])->name('copyConfigDevice');
            Route::post('commun/{id}', [DeviceConfigController::class, 'communConfigDevice'])->name('communConfigDevice');
            Route::post('move/{id}', [DeviceConfigController::class, 'moveConfigDevice'])->name('moveConfigDevice');

            Route::post('debug', [DeviceConfigController::class, 'getDebugData'])->name('getDebugData');

            Route::prefix('eventLog')->group(function () {
                Route::post('get', [DeviceConfigController::class, 'getEventLog'])->name('getEventLog');
                Route::post('delete/{id}', [DeviceConfigController::class, 'deleteEventLog'])->name('deleteEventLog');
            });
        });

        Route::prefix('sensor')->group(function () {
            Route::post('all', [DeviceConfigController::class, 'getAllSensor'])->name('getAllSensor');
            Route::post('get/{id}', [DeviceConfigController::class, 'getConfigSensor'])->name('getConfigSensor');
            Route::post('add', [DeviceConfigController::class, 'addConfigSensor'])->name('addConfigSensor');
            Route::post('edit/{id}', [DeviceConfigController::class, 'editConfigSensor'])->name('editConfigSensor');
            Route::post('settings/{id}', [DeviceConfigController::class, 'settingsConfigSensor'])->name('settingsConfigSensor');
            Route::post('delete/{id}', [DeviceConfigController::class, 'deleteConfigSensor'])->name('deleteConfigSensor');
            Route::post('copy/{id}', [DeviceConfigController::class, 'copyConfigSensor'])->name('copyConfigSensor');
            Route::post('move/{id}', [DeviceConfigController::class, 'moveConfigSensor'])->name('moveConfigSensor');
        });

        Route::prefix('bumpTest')->group(function () {
            Route::post('start', [DeviceConfigController::class, 'startBumpTest'])->name('startBumpTest');
            Route::post('run', [DeviceConfigController::class, 'runBumpTest'])->name('runBumpTest');
        });

        Route::post('deleteImage/{table}/{id}', [DeviceConfigController::class, 'deleteImage'])->name('deleteImage');
    });

    Route::prefix('emailConfig')->group(function () {
        Route::post('get/{id}', [EmailConfigController::class, 'getEmailConfig'])->name('getEmailConfig');
        Route::post('add', [EmailConfigController::class, 'addEmailConfig'])->name('addEmailConfig');
        Route::post('edit/{id}', [EmailConfigController::class, 'editEmailConfig'])->name('editEmailConfig');
        Route::post('delete/{id}', [EmailConfigController::class, 'deleteEmailConfig'])->name('deleteEmailConfig');
    });

    Route::prefix('deviceManagement')->group(function () {
        Route::prefix('categories')->group(function () {
            Route::post('add', [DeviceManagementController::class, 'addCategory'])->name('addCategory');
            Route::post('edit', [DeviceManagementController::class, 'editCategory'])->name('editCategory');
            Route::post('delete', [DeviceManagementController::class, 'deleteCategory'])->name('deleteCategory');
            Route::post('{id?}', [DeviceManagementController::class, 'getCategory'])->name('getCategory');
        });

        Route::prefix('units')->group(function () {
            Route::post('get/{id}', [DeviceManagementController::class, 'getUnit'])->name('getUnit');
            Route::post('add', [DeviceManagementController::class, 'addUnit'])->name('addUnit');
            Route::post('edit/{id}', [DeviceManagementController::class, 'editUnit'])->name('editUnit');
            Route::post('delete/{id}', [DeviceManagementController::class, 'deleteUnit'])->name('deleteUnit');
        });

        Route::prefix('sensorOutput')->group(function () {
            Route::post('get/{id}', [DeviceManagementController::class, 'getSensorOutput'])->name('getSensorOutput');
            Route::post('add', [DeviceManagementController::class, 'addSensorOutput'])->name('addSensorOutput');
            Route::post('edit/{id}', [DeviceManagementController::class, 'editSensorOutput'])->name('editSensorOutput');
            Route::post('delete/{id}', [DeviceManagementController::class, 'deleteSensorOutput'])->name('deleteSensorOutput');
        });

        Route::prefix('aqi')->group(function () {
            Route::post('get/{id}', [DeviceManagementController::class, 'getAqiParameter'])->name('getAqiParameter');
            Route::post('add', [DeviceManagementController::class, 'addAqiParameter'])->name('addAqiParameter');
            Route::post('edit/{id}', [DeviceManagementController::class, 'editAqiParameter'])->name('editAqiParameter');
            Route::post('delete/{id}', [DeviceManagementController::class, 'deleteAqiParameter'])->name('deleteAqiParameter');
        });

        Route::prefix('defaultSensors')->group(function () {
            Route::post('get/{id}', [DeviceManagementController::class, 'getDefaultSensor'])->name('getDefaultSensor');
            Route::post('add', [DeviceManagementController::class, 'addDefaultSensor'])->name('addDefaultSensor');
            Route::post('edit/{id}', [DeviceManagementController::class, 'editDefaultSensor'])->name('editDefaultSensor');
            Route::post('delete/{id}', [DeviceManagementController::class, 'deleteDefaultSensor'])->name('deleteDefaultSensor');
        });

        Route::prefix('sensorType')->group(function () {
            Route::post('get/{id}', [DeviceManagementController::class, 'getSensorType'])->name('getSensorType');
            Route::post('add', [DeviceManagementController::class, 'addSensorType'])->name('addSensorType');
            Route::post('edit/{id}', [DeviceManagementController::class, 'editSensorType'])->name('editSensorType');
            Route::post('delete/{id}', [DeviceManagementController::class, 'deleteSensorType'])->name('deleteSensorType');
        });

        Route::prefix('communicationConfig')->group(function () {
            Route::post('get/{id}', [DeviceManagementController::class, 'getCommunicationConfig'])->name('getCommunicationConfig');
            Route::post('add', [DeviceManagementController::class, 'addCommunicationConfig'])->name('addCommunicationConfig');
            Route::post('edit/{id}', [DeviceManagementController::class, 'updateCommunicationConfig'])->name('updateCommunicationConfig');
            Route::post('delete/{id}', [DeviceManagementController::class, 'deleteCommunicationConfig'])->name('deleteCommunicationConfig');
        });
    });

    Route::post('getLocationDetails', [DeviceConfigController::class, 'getLocationDetails'])->name('getLocationDetails');
    Route::post('sendMail', [ConfigDeviceController::class, 'sendMail'])->name('sendMail');



});

// Device to server communication
Route::prefix('configDevice')->group(function () {
    Route::post('get', [ConfigDeviceController::class, 'getConfigDevice'])->name('getConfigDevice');
});

Route::prefix('device')->group(function () {
    Route::post('pushData', [DeviceModeController::class, 'devicePushData'])->name('devicePushData');
});

Route::prefix('deviceEventLog')->group(function () {
    Route::post('log/{fileName}', [ConfigDeviceController::class, 'createEventLog'])->name('createEventLog');
});


Route::prefix('transactions')->group(function () {
    Route::any('list/{id}', [TransactionsController::class, 'listTransactions'])->name('listTransactions');
    Route::any('add', [TransactionsController::class, 'addTransactions'])->name('addTransactions');
    Route::any('update/{id}', [TransactionsController::class, 'updateTransactions'])->name('updateTransactions');
});