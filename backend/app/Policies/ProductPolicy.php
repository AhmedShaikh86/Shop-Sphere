<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function manage(User $user, Product $product): bool
    {
        return $user->isAdmin() || $product->store->user_id === $user->id;
    }
}
