<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * A thin wrapper around ActivityLog::create so every admin/seller action
 * records who did what, without repeating the same create() call everywhere.
 */
class ActivityLogger
{
    public function log(?User $user, string $action, ?Model $subject = null, ?string $description = null, array $properties = []): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => $user?->id,
            'action' => $action,
            'subject_type' => $subject ? $subject::class : null,
            'subject_id' => $subject?->id,
            'description' => $description,
            'properties' => $properties,
        ]);
    }
}
