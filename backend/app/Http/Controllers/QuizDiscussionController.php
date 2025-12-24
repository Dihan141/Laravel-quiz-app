<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizDiscussion;
use Illuminate\Http\Request;

class QuizDiscussionController extends Controller
{
 public function index(Quiz $quiz)
    {
        $user = auth()->user();

        // Authorization: teacher or attempted student
        $isTeacher = $quiz->teacher_id === $user->id;
        $hasAttempted = $quiz->attempts()
            ->where('student_id', $user->id)
            ->exists();

        if (!$isTeacher && !$hasAttempted) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $messages = $quiz->discussions()
            ->with('user:id,name')
            ->orderBy('created_at')
            ->get()
            ->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'user' => $msg->user->name,
                    'text' => $msg->message
                ];
            });

        return response()->json($messages);
    }

    // Post a message
    public function store(Request $request, Quiz $quiz)
    {
        $user = auth()->user();

        $isTeacher = $quiz->teacher_id === $user->id;
        $hasAttempted = $quiz->attempts()
            ->where('student_id', $user->id)
            ->exists();

        if (!$isTeacher && !$hasAttempted) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'message' => 'required|string|max:2000'
        ]);

        $discussion = QuizDiscussion::create([
            'quiz_id' => $quiz->id,
            'user_id' => $user->id,
            'message' => $request->message
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $discussion->id,
                'user' => $user->name,
                'text' => $discussion->message
            ]
        ], 201);
    }
}
