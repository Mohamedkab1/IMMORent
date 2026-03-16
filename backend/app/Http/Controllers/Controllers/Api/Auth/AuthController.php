<?php
namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $clientRole = Role::where('slug', Role::CLIENT)->first();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $clientRole->id,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        // Créer le token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => $user->load('role'),
            'token' => $token
        ], 'Inscription réussie', 201);
    }

    /**
     * Connexion utilisateur
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::with('role')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.']
            ]);
        }

        if (!$user->is_active) {
            return $this->errorResponse('Votre compte a été désactivé. Contactez l\'administrateur.', 403);
        }

        // Révoquer les anciens tokens
        $user->tokens()->delete();
        
        // Créer un nouveau token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Mettre à jour la dernière connexion
        $user->update(['last_login_at' => now()]);

        return $this->successResponse([
            'user' => $user,
            'token' => $token
        ], 'Connexion réussie');
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Déconnexion réussie');
    }

    /**
     * Utilisateur connecté
     */
    public function me(Request $request)
    {
        $user = $request->user()->load([
            'role', 
            'contractsAsTenant.property',
            'contractsAsOwner',
            'rentalRequests.property'
        ]);

        return $this->successResponse($user);
    }
}