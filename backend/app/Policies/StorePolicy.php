<?php

namespace App\Policies;

use App\Models\Store;
use App\Models\User;

class StorePolicy
{
    public function manage(User $user, Store $store): bool
    {
        return $user->isAdmin() || $store->user_id === $user->id;
    }
}
