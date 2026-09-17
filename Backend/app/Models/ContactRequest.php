<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactRequest extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'property_id',
        'agent_id',
        'name',
        'phone',
        'email',
        'message',
        'status',
    ];

    /**
     * The property this request is about.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * The agent (owner of the property) who receives this request.
     */
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}

