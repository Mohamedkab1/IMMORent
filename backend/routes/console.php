<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('geocode:properties', function () {
    $properties = \App\Models\Property::whereNull('latitude')->orWhere('latitude', 0)->get();
    $this->info("Found " . $properties->count() . " properties to geocode.");
    
    foreach ($properties as $property) {
        if (!$property->address) continue;
        
        $this->comment("Geocoding: " . $property->address);
        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'User-Agent' => 'IMMORent-App'
            ])->get('https://nominatim.openstreetmap.org/search', [
                'q' => $property->address,
                'format' => 'json',
                'limit' => 1,
            ]);

            $coords = $response->json();
            if (!empty($coords)) {
                $property->update([
                    'latitude' => $coords[0]['lat'],
                    'longitude' => $coords[0]['lon']
                ]);
                $this->info("Success: " . $coords[0]['lat'] . ", " . $coords[0]['lon']);
            } else {
                $this->error("No coordinates found.");
            }
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
        }
        
        // Rate limiting
        usleep(1000000);
    }
    
    $this->info("Finished geocoding.");
})->purpose('Geocode properties that have an address but no coordinates');
