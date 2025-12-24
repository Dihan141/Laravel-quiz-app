<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\QuizAnalyticsController;
use App\Http\Controllers\QuizAttemptController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuizDiscussionController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\TeacherOptionController;
use App\Http\Controllers\TeacherQuestionController;
use App\Http\Controllers\TeacherQuizController;
use Illuminate\Http\Request;

Route::post('/auth/register', [RegisterController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [LogoutController::class, 'logout']);
    
    Route::get('/me', function(Request $request){
        return response()->json([
            'user' => $request->user(),
            'roles' => $request->user()->roles->pluck('name')
        ]);
    });

    //Quiz Discussions
    Route::get('/quizzes/{quiz}/discussions', [QuizDiscussionController::class, 'index']);
    Route::post('/quizzes/{quiz}/discussions', [QuizDiscussionController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    // Quizzes
    Route::get('/student/quizzes', [QuizController::class, 'index']);
    Route::get('/student/quizzes/{quiz}', [QuizController::class, 'show']);

    // Quiz Attempts
    Route::post('/student/quizzes/{quiz}/start', [QuizAttemptController::class, 'start']);
    Route::post('/student/attempts/{attempt}/answer', [QuizAttemptController::class, 'answer']);
    Route::post('/student/attempts/{attempt}/submit', [QuizAttemptController::class, 'submit']);
    Route::get('/student/attempts/{attempt}/results', [QuizAttemptController::class, 'results']);
});

Route::middleware(['auth:sanctum','role:teacher'])->prefix('teacher')->group(function(){
    // Quizzes
    Route::get('/quizzes',[TeacherQuizController::class,'index']);
    Route::post('/quizzes',[TeacherQuizController::class,'store']);
    Route::put('/quizzes/{quiz}',[TeacherQuizController::class,'update']);
    Route::delete('/quizzes/{quiz}',[TeacherQuizController::class,'destroy']);

    // Questions
    Route::get('/quizzes/{quiz}/questions',[TeacherQuestionController::class,'index']);
    Route::post('/quizzes/{quiz}/questions',[TeacherQuestionController::class,'store']);
    Route::put('/questions/{question}',[TeacherQuestionController::class,'update']);
    Route::delete('/questions/{question}',[TeacherQuestionController::class,'destroy']);

    // Options
     Route::get('/questions/{question}/options',[TeacherOptionController::class,'index']);
    Route::post('/questions/{question}/options',[TeacherOptionController::class,'store']);
    Route::put('/options/{option}',[TeacherOptionController::class,'update']);
    Route::delete('/options/{option}',[TeacherOptionController::class,'destroy']);

    // Annalytics
    Route::get('/quizzes/{quiz}/analytics', [QuizAnalyticsController::class, 'show']);
});
