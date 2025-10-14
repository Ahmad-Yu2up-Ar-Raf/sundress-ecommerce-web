<?php

namespace App\Models;

use App\Enums\UserOccupasion;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable , HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'country',
        'password',
        'province',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'country' => 'string',
            'province' => 'string',
            'occupasion' => UserOccupasion::class
        ];
    }



     public function products()
    {
        return $this->hasMany(Products::class ,  'user_id');
    }
     public function cartItems()
    {
        return $this->hasMany(CartItems::class ,  'user_id');
    }

    public function orders()
    {
        return $this->hasMany(Orders::class , 'user_id');
    }
    public function whishlist()
    {
        return $this->hasMany(Whishlist::class , 'user_id');
    }

    public function reviews()
    {
        return $this->hasMany(Reviews::class ,  'user_id');
    }

}
