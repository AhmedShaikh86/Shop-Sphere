<?php

namespace App\Exceptions;

use Exception;

class InsufficientStockException extends Exception
{
    public function __construct(public readonly string $productName)
    {
        parent::__construct("Not enough stock available for \"{$productName}\".");
    }
}
