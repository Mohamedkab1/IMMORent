$user = \App\Models\User::whereHas('role', function($q) { $q->where('slug', 'agent'); })->first();
if ($user) {
    $controller = new \App\Http\Controllers\Api\DashboardController();
    $request = new \Illuminate\Http\Request();
    $request->setUserResolver(function() use ($user) { return $user; });
    $response = $controller->stats($request);
    echo json_encode($response->getData());
} else {
    echo "No agent found";
}
