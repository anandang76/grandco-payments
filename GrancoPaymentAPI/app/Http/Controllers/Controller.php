<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

use App\DeviceJwt;
use JWTAuth;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function generateJWT($user)
    {
        $encryption_key = env('APP_KEY');
        $time = time();
        $currentDevice = new DeviceJwt($user, $time);
        $token = JWTAuth::fromUser($currentDevice);
        return $token;
    }
}
