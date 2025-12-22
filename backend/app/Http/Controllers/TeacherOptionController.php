<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\Question;
use Illuminate\Http\Request;

class TeacherOptionController extends Controller
{
    public function index(Question $question)
    {
        if ($question->quiz->teacher_id !== auth()->id()) {
            return response()->json(['success'=>false,'message'=>'Unauthorized'],403);
        }

        $options = $question->options()->get();
        return response()->json(['success'=>true,'options'=>$options]);
    }
    // Add option to a question
    public function store(Request $request, Question $question)
    {
        if ($question->quiz->teacher_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'option_text' => 'required|string',
            'is_correct' => 'required|boolean',
        ]);

        $option = $question->options()->create($request->only('option_text', 'is_correct'));

        return response()->json(['success' => true, 'option' => $option]);
    }

    // Update option
    public function update(Request $request, Option $option)
    {
        if ($option->question->quiz->teacher_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'option_text' => 'sometimes|string',
            'is_correct' => 'sometimes|boolean',
        ]);

        $option->update($request->only('option_text', 'is_correct'));

        return response()->json(['success' => true, 'option' => $option]);
    }

    // Delete option
    public function destroy(Option $option)
    {
        if ($option->question->quiz->teacher_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $option->delete();

        return response()->json(['success' => true, 'message' => 'Option deleted']);
    }
}
