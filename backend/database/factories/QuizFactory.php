<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quiz>
 */
class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition(): array
    {
        return [
            'teacher_id' => User::factory()->create()->id,
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'time_limit' => $this->faker->numberBetween(10,60),
            'is_published' => $this->faker->boolean(80),
        ];
    }
}
