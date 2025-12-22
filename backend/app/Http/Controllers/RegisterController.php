<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
    try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
                'role' => 'required|in:admin,teacher,student',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
            ]);

            $role = Role::where('name', $validated['role'])->firstOrFail();
            $user->roles()->attach($role);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);

        } catch (QueryException $e) {
            // DB constraint issues (edge case)
            return response()->json([
                'success' => false,
                'message' => 'User already exists'
            ], 409);

        } catch (\Exception $e) {
            // Anything unexpected
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong'
            ], 500);
        }
    }

}
