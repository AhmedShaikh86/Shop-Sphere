<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        if ($user->isAdmin() || $order->user_id === $user->id) {
            return true;
        }

        if ($user->isSeller()) {
            return $order->items()->where('store_id', $user->store?->id)->exists();
        }

        return false;
    }
}
