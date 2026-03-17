<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AgentMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || (!$user->isAgent() && !$user->isAdmin())) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé. Rôle agent ou administrateur requis.'
            ], 403);
        }

        return $next($request);
    }
}
