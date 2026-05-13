<?php

use Illuminate\Support\Facades\DB;
use App\Models\RentalRequest;
use App\Models\Payment;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\Property;
use App\Models\Notification;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Début du nettoyage de l'historique...\n";

try {
    DB::beginTransaction();

    // 1. Supprimer les factures
    $invoicesCount = DB::table('invoices')->delete();
    echo "- $invoicesCount factures supprimées.\n";

    // 2. Supprimer les paiements
    $paymentsCount = DB::table('payments')->delete();
    echo "- $paymentsCount paiements supprimés.\n";

    // 3. Supprimer les contrats
    $contractsCount = DB::table('contracts')->delete();
    echo "- $contractsCount contrats supprimés.\n";

    // 4. Supprimer les demandes de location
    $requestsCount = DB::table('rental_requests')->delete();
    echo "- $requestsCount demandes supprimées.\n";

    // 5. Supprimer les notifications liées
    $notificationsCount = DB::table('notifications')->whereIn('type', [
        'App\Notifications\GeneralNotification',
        'App\Notifications\NewRentalRequest',
        'request',
        'payment',
        'contract'
    ])->delete();
    echo "- $notificationsCount notifications supprimées.\n";

    // 6. Remettre tous les biens en 'available'
    $propertiesUpdated = DB::table('properties')->update(['status' => 'available']);
    echo "- $propertiesUpdated biens remis en statut 'available'.\n";

    DB::commit();
    echo "\nNettoyage terminé avec succès !\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\nERREUR lors du nettoyage : " . $e->getMessage() . "\n";
}
