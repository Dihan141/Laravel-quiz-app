<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $teacherRole = Role::firstOrCreate(['name' => 'teacher']);
        $studentRole = Role::firstOrCreate(['name' => 'student']);

        // Create teacher
        $teacher = User::factory()->create([
            'name' => 'John Teacher',
            'email' => 'teacher@example.com',
            'password' => bcrypt('password')
        ]);
        $teacher->roles()->attach($teacherRole);

        // Create students
        $students = User::factory(5)->create()->each(function($user) use ($studentRole){
            $user->roles()->attach($studentRole);
        });

        // Create quizzes for teacher
        $quizzes = Quiz::factory(3)->create(['teacher_id' => $teacher->id]);

        foreach ($quizzes as $quiz) {
            // Create 5 questions per quiz
            $questions = Question::factory(5)->create(['quiz_id' => $quiz->id]);

            foreach ($questions as $question) {
                // Create 4 options per question
                for ($i=0; $i<4; $i++) {
                    Option::factory()->create([
                        'question_id' => $question->id,
                        'is_correct' => $i === 0 // first option correct for simplicity
                    ]);
                }
            }
        }

        $this->command->info('Seeded roles, users, quizzes, questions, options.');
    }
}
