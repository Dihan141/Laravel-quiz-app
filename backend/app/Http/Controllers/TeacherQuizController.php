<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeacherQuizController extends Controller
{
    // List all quizzes created by teacher
    public function index()
    {
        $quizzes = Auth::user()->quizzes()->withCount('questions')->get();
        return response()->json(['success' => true, 'data' => $quizzes]);
    }

    // Create a new quiz
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'nullable|integer|min:1',
        ]);

        $quiz = Quiz::create([
            'teacher_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'time_limit' => $request->time_limit,
            'is_published' => false,
        ]);

        return response()->json(['success' => true, 'quiz' => $quiz]);
    }

    // Update quiz
    public function update(Request $request, Quiz $quiz)
    {
        if ($quiz->teacher_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'nullable|integer|min:1',
            'is_published' => 'nullable|boolean',
        ]);

        $quiz->update($request->only('title', 'description', 'time_limit', 'is_published'));

        return response()->json(['success' => true, 'quiz' => $quiz]);
    }

    // Delete quiz
    public function destroy(Quiz $quiz)
    {
        if ($quiz->teacher_id !== Auth::id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $quiz->delete();

        return response()->json(['success' => true, 'message' => 'Quiz deleted']);
    }
}
