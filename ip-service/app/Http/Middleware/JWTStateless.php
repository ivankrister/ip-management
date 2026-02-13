<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

final class JWTStateless
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $token = JWTAuth::parseToken();
            $payload = $token->getPayload();

            // Create a user instance from JWT payload without database lookup
            $user = new User;
            $user->id = $payload->get('sub');
            $user->email = $payload->get('email');
            $user->name = $payload->get('name');
            $user->user_type = $payload->get('user_type');
            $user->exists = true; // Mark as existing to prevent save attempts

            // Set the authenticated user for both request()->user() and auth()->user()
            $request->setUserResolver(fn () => $user);
            Auth::shouldUse('api');
            Auth::setUser($user);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        return $next($request);
    }
}
