<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'url', 'photo_credit_name', 'photo_credit_url'])]
class SiteImage extends Model
{
    //
}
