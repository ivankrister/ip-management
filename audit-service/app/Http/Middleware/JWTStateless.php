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

            $user = new User;
            $user->id = $payload->get('sub');
            $user->email = $payload->get('email');
            $user->name = $payload->get('name');
            $user->role = $payload->get('role');
            $user->exists = true;

            $request->setUserResolver(fn (): User => $user);
            Auth::shouldUse('api');
            Auth::setUser($user);

        } catch (JWTException) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        return $next($request);
    }
}
