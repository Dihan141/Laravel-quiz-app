import { useEffect, useState } from "react";
import { useParams, useNavigate, replace } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import api from "../../api";

export default function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentIndex];

  /* ───────── Fetch Quiz + Start Quiz ───────── */
  useEffect(() => {
    const initQuiz = async () => {
      try {
        // 1️⃣ Fetch quiz details
        const quizRes = await api.get(`/student/quizzes/${quizId}`);
        const quiz = quizRes.data.quiz;

        setQuestions(quiz.questions);
        setTimeLeft(quiz.time_limit * 60); // minutes → seconds

        // 2️⃣ Start quiz
        const startRes = await api.post(`/student/quizzes/${quizId}/start`);
        setAttemptId(startRes.data.attempt_id);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    initQuiz();
  }, [quizId]);

  /* ───────── Timer ───────── */
  useEffect(() => {
    if (!attemptId) return;

    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, attemptId]);

  /* ───────── Save Answer ───────── */
  const saveAnswer = async () => {
    if (!selectedOptionId) return;

    await api.post(`/student/attempts/${attemptId}/answer`, {
      question_id: currentQuestion.id,
      selected_option_id: selectedOptionId,
    });
  };

  /* ───────── Next / Submit ───────── */
  const handleNext = async () => {
    await saveAnswer();
    setSelectedOptionId(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  /* ───────── Submit Quiz ───────── */
  const submitQuiz = async () => {
    await api.post(`/student/attempts/${attemptId}/submit`);

    navigate(`/student-quiz-detail/${quizId}`, { replace: true });
  };

  if (loading || !currentQuestion) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={700} mx="auto">
      {/* Timer */}
      <Typography textAlign="right" color="error" mb={2}>
        Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </Typography>

      {/* Question Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Question {currentIndex + 1} of {questions.length}
          </Typography>

          <Typography mb={2}>{currentQuestion.question_text}</Typography>

          <RadioGroup
            value={selectedOptionId}
            onChange={(e) => setSelectedOptionId(Number(e.target.value))}
          >
            {currentQuestion.options.map((opt) => (
              <FormControlLabel
                key={opt.id}
                value={opt.id}
                control={<Radio />}
                label={opt.option_text}
              />
            ))}
          </RadioGroup>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedOptionId}
            onClick={handleNext}
          >
            {currentIndex === questions.length - 1 ? "Submit Quiz" : "Next"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
