<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contract;
use App\Models\Property;
use App\Models\User;
use App\Models\RentalRequest;

class ContractSeeder extends Seeder
{
    public function run()
    {
        $properties = Property::all();
        $clients = User::where('role_id', 3)->get();
        $agents = User::where('role_id', 2)->get();
        $owners = User::where('role_id', 3)->get();

        foreach ($properties as $index => $property) {
            $client = $clients[$index % count($clients)];
            $agent = $agents[$index % count($agents)];
            $owner = $owners[$index % count($owners)];
            
            // Chercher une demande existante pour ce bien
            $rentalRequest = RentalRequest::where('property_id', $property->id)
                ->where('status', 'approved')
                ->first();
            
            Contract::create([
                'contract_number' => 'CTR-2024-' . str_pad($property->id, 4, '0', STR_PAD_LEFT),
                'rental_request_id' => $rentalRequest ? $rentalRequest->id : null,
                'property_id' => $property->id,
                'tenant_id' => $client->id,
                'owner_id' => $owner->id,
                'agent_id' => $agent->id,
                'start_date' => '2024-01-01',
                'end_date' => '2024-12-31',
                'monthly_rent' => $property->price,
                'security_deposit' => $property->price,
                'charges' => 50,
                'status' => 'active',
                'signed_at' => now(),
            ]);
        }
        
        $this->command->info('Contrats créés avec succès!');
    }
}