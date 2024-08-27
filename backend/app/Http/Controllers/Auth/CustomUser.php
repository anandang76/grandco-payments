<?php

namespace App\Http\Controllers\Auth;
use Tymon\JWTAuth\Contracts\JWTSubject;

class CustomUser implements JWTSubject
{
    private $user;
    private $time;

    public function __construct($user, $time)
    {
        $this->id = $user->id;
        $this->email = $user->email;
        $this->name = $user->name;
        $this->current_time = $time;
    }

    public function getJWTIdentifier()
    {
        return $this->id;
    }

    public function getJWTCustomClaims()
    {
        $return['id'] = $this->id;
        $return['email'] = $this->email;
        $return['name'] = $this->name;
        $return['iat'] = $this->current_time;
        return $return;
    }
}
