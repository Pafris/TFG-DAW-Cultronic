<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        // Un invitado debe ser redirigido al login (302)
        $response = $this->get('/');
        $response->assertStatus(302);

        // Un usuario autenticado debe ver la página de inicio (200)
        $user = \App\Models\User::factory()->create();
        $authenticatedResponse = $this->actingAs($user)->get('/');
        $authenticatedResponse->assertStatus(200);
    }
}
