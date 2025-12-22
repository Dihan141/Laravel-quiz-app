<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        try {
            // 1️⃣ Validate input
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            // 2️⃣ Attempt authentication
            if (! Auth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password',
                ], 401);
            }

            // 3️⃣ Get authenticated user
            $user = $request->user();

            // 4️⃣ Refresh token (single active token policy)
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            // 5️⃣ Success response
            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                ],
            ], 200);

        } catch (ValidationException $e) {
            // ❌ Input validation failed
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
            ], 422);

        } catch (QueryException $e) {
            // ❌ Database issue (rare here, but safe)
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred',
            ], 500);

        } catch (\Exception $e) {
            // ❌ Anything unexpected
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
            ], 500);
        }
    }
}
