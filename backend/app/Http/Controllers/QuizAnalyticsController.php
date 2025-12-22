<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizAnalyticsController extends Controller
{
    public function show(Quiz $quiz)
    {
        // Ensure the authenticated teacher owns this quiz
        $teacher = auth()->user();
        if ($quiz->teacher_id !== $teacher->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Fetch all attempts for this quiz
        $attempts = $quiz->attempts()->with('student:id,name')->get();

        $scores = $attempts->pluck('score');

        // Prepare summary
        $summary = [
            'attempts' => $attempts->count(),
            'average' => $scores->count() ? round($scores->avg(), 2) : 0,
            'min' => $scores->count() ? $scores->min() : 0,
            'max' => $scores->count() ? $scores->max() : 0,
        ];

        // Prepare students data
        $students = $attempts->map(function ($attempt) {
            return [
                'id' => $attempt->student->id,
                'name' => $attempt->student->name,
                'score' => $attempt->score,
                'submitted_at' => $attempt->finished_at ? $attempt->finished_at->format('Y-m-d') : null
            ];
        });

        return response()->json([
            'success' => true,
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title
            ],
            'summary' => $summary,
            'students' => $students
        ]);
    }
}
