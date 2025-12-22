<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\Request;

class TeacherQuestionController extends Controller
{
    public function index(Quiz $quiz)
    {
        if ($quiz->teacher_id !== auth()->id()) {
            return response()->json(['success'=>false,'message'=>'Unauthorized'],403);
        }

        $questions = $quiz->questions()->withCount('options')->get();
        return response()->json(['success'=>true,'questions'=>$questions]);
    }
    // Add question to a quiz
    public function store(Request $request, Quiz $quiz)
    {
        if ($quiz->teacher_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|in:mcq,true_false,short',
        ]);

        $question = $quiz->questions()->create($request->only('question_text', 'type'));

        return response()->json(['success' => true, 'question' => $question]);
    }

    // Update question
    public function update(Request $request, Question $question)
    {
        if ($question->quiz->teacher_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'question_text' => 'sometimes|string',
            'type' => 'sometimes|in:mcq,true_false,short',
        ]);

        $question->update($request->only('question_text', 'type'));

        return response()->json(['success' => true, 'question' => $question]);
    }

    // Delete question
    public function destroy(Question $question)
    {
        if ($question->quiz->teacher_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $question->delete();

        return response()->json(['success' => true, 'message' => 'Question deleted']);
    }
}
