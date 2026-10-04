<?php

return [
    // Flat-rate shipping in USD, waived once the cart subtotal reaches the threshold.
    'shipping_flat_rate' => 9.99,
    'free_shipping_threshold' => 150.00,

    // Simple flat sales-tax rate applied to the order subtotal after discount.
    'tax_rate' => 0.08,

    // A variant is "low stock" once its available quantity drops to or below this.
    'low_stock_threshold' => 5,
];
