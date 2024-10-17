<?php

namespace App;
use Tymon\JWTAuth\Contracts\JWTSubject;

class DeviceJwt implements JWTSubject
{
    private $user;
    private $time;

    public function __construct($user, $time)
    {
        $this->id = $user->id;
        $this->deviceName = $user->deviceName;
        $this->deviceAuthID = $user->deviceAuthID;
        $this->current_time = $time;
    }

    public function getJWTIdentifier()
    {
        return $this->id;
    }

    public function getJWTCustomClaims()
    {
        $return['id'] = $this->id;
        $return['deviceName'] = $this->deviceName;
        $return['deviceAuthID'] = $this->deviceAuthID;
        $return['iat'] = $this->current_time;
        return $return;
    }
}
