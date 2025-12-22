<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizAttemptController extends Controller
{
    // Start a quiz attempt
    public function start(Quiz $quiz)
    {
        $user = Auth::user();

        if (!$quiz->is_published) {
            return response()->json(['success' => false, 'message' => 'Quiz not available'], 403);
        }

        // Only one attempt per student
        if (QuizAttempt::where('quiz_id', $quiz->id)
            ->where('student_id', $user->id)
            ->exists()
        ) {
            return response()->json(['success' => false, 'message' => 'You have already attempted this quiz'], 400);
        }

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => $user->id,
            'started_at' => now(),
        ]);

        return response()->json(['success' => true, 'attempt_id' => $attempt->id]);
    }

    // Submit an answer for a question
    public function answer(Request $request, QuizAttempt $attempt)
    {
        $user = Auth::user();

        if ($attempt->student_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if ($attempt->isSubmitted()) {
            return response()->json(['success' => false, 'message' => 'Quiz already submitted'], 400);
        }

        $request->validate([
            'question_id' => 'required|exists:questions,id',
            'selected_option_id' => 'nullable|exists:options,id'
        ]);

        $answer = Answer::updateOrCreate(
            ['attempt_id' => $attempt->id, 'question_id' => $request->question_id],
            ['selected_option_id' => $request->selected_option_id]
        );

        return response()->json(['success' => true, 'answer' => $answer]);
    }

    // Submit the quiz and calculate score
    public function submit(QuizAttempt $attempt)
    {
        $user = Auth::user();

        if ($attempt->student_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if ($attempt->isSubmitted()) {
            return response()->json(['success' => false, 'message' => 'Quiz already submitted'], 400);
        }

        $score = 0;

        foreach ($attempt->answers as $answer) {
            $option = $answer->selectedOption;
            if ($option && $option->is_correct) {
                $score++;
            }
        }

        $attempt->update([
            'score' => $score,
            'finished_at' => now(),
        ]);

        return response()->json(['success' => true, 'score' => $score]);
    }

    // Get quiz results (only after submission)
    public function results(QuizAttempt $attempt)
    {
        $user = Auth::user();

        if ($attempt->student_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$attempt->isSubmitted()) {
            return response()->json([
                'success' => false,
                'message' => 'Quiz not submitted yet'
            ], 400);
        }

        $quiz = $attempt->quiz()->with([
            'questions.options:id,question_id,option_text,is_correct',
            'questions.answers' => function ($q) use ($attempt) {
                $q->where('attempt_id', $attempt->id);
            }
        ])->first();

        $questions = $quiz->questions->map(function ($question) {
            $studentAnswer = $question->answers->first();

            return [
                'question_id' => $question->id,
                'question_text' => $question->question_text,

                'options' => $question->options->map(function ($option) use ($studentAnswer) {
                    return [
                        'option_id' => $option->id,
                        'option_text' => $option->option_text,
                        'is_correct' => $option->is_correct,
                        'selected_by_student' =>
                            $studentAnswer
                            && $studentAnswer->selected_option_id === $option->id
                    ];
                }),

                'answered' => $studentAnswer !== null
            ];
        });

        return response()->json([
            'success' => true,
            'attempt_id' => $attempt->id,
            'score' => $attempt->score,
            'total_questions' => $quiz->questions->count(),
            'questions' => $questions
        ]);
    }

}