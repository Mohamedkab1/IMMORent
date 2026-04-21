<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{
    /**
     * Get all settings grouped by group.
     */
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $settings = DB::table('settings')->get();

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Update multiple settings.
     */
    public function updateBulk(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        foreach ($request->settings as $item) {
            DB::table('settings')
                ->where('key', $item['key'])
                ->update(['value' => $item['value'], 'updated_at' => now()]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Paramètres mis à jour avec succès'
        ]);
    }
}
