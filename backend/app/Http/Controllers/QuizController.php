<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    // List all available quizzes
    public function index()
    {
        $user = auth()->user();

        $quizzes = Quiz::where('is_published', true)
            ->with([
                'teacher:id,name',
                'attempts' => function ($q) use ($user) {
                    $q->where('student_id', $user->id);
                }
            ])
            ->get()
            ->map(function ($quiz) {
                $attempt = $quiz->attempts->first();

                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'time_limit' => $quiz->time_limit,
                    'teacher_name' => $quiz->teacher->name ?? null,

                    // ✅ added
                    'has_attempted' => $attempt !== null,
                    'attempt_id' => $attempt?->id,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $quizzes
        ]);
    }

    // Show quiz with questions (hide correct options)
    public function show(Quiz $quiz)
    {
        $user = auth()->user(); 
        if (!$quiz->is_published) {
            return response()->json(['success' => false, 'message' => 'Quiz not available'], 403);
        }

        $quiz->load('teacher:id,name');

        $hasAttempted = $quiz->attempts()
            ->where('student_id', $user->id)
            ->exists();

        $attempt = $quiz->attempts()
            ->where('student_id', $user->id)
            ->first();

        $questions = $quiz->questions()
            ->with(['options:id,question_id,option_text'])
            ->get();

        return response()->json([
            'success' => true,
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                "teacher_name"=> $quiz->teacher->name ?? null,
                'description' => $quiz->description,
                'time_limit' => $quiz->time_limit,
                'has_attempted' => $hasAttempted,
                'attempt_id' => $attempt?->id,
                'questions' => $questions
            ]
        ]);
    }
}
