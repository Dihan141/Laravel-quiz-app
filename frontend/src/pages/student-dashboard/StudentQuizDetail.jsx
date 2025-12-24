import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Container,
  Divider,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Person4Icon from "@mui/icons-material/Person4";
import TimerIcon from "@mui/icons-material/Timer";
import { useFetch } from "../../hooks/useFetch";
import api from "../../api";
import DiscussionSection from "./components/DiscussionSection";

export default function StudentQuizDetail() {
  const navigate = useNavigate();
  const { id: quizId } = useParams();

  const [tab, setTab] = useState(0);

  // Quiz details
  const { data, loading, error } = useFetch(`/student/quizzes/${quizId}`);
  const quiz = data?.quiz;

  const hasAttempted = quiz?.has_attempted;
  const attemptId = quiz?.attempt_id;

  // Results state
  const [results, setResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  // Fetch results ONLY when Answers tab opens
  useEffect(() => {
    if (tab === 1 && hasAttempted && attemptId && !results) {
      setResultsLoading(true);
      setResultsError(null);

      api
        .get(`/student/attempts/${attemptId}/results`)
        .then((res) => {
          setResults(res.data);
        })
        .catch((err) => {
          console.error(err);
          setResultsError("Failed to load quiz results");
        })
        .finally(() => {
          setResultsLoading(false);
        });
    }
  }, [tab, hasAttempted, attemptId, results]);

  const handleStartQuiz = () => {
    navigate(`/quiz/${quizId}/start`);
  };

  if (loading) {
    return (
      <Box mt={6} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!quiz) return null;

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        {/* Quiz Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {quiz.title}
            </Typography>

            <Box display="flex" gap={1}>
              <Person4Icon sx={{ color: "text.secondary" }} />
              <Typography color="text.secondary">
                {quiz.teacher_name}
              </Typography>
            </Box>

            <Box display="flex" gap={1} mt={1}>
              <TimerIcon sx={{ color: "text.secondary" }} />
              <Typography color="text.secondary">
                {quiz.time_limit} minutes
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleStartQuiz}
              disabled={hasAttempted}
            >
              {hasAttempted ? "Already Attempted" : "Start Quiz"}
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Quiz Details" />
          <Tab
            label="Answers"
            disabled={!hasAttempted}
            icon={
              !hasAttempted ? (
                <LockIcon
                  fontSize="small"
                  sx={{ height: "15px", width: "15px", mt: "-3px" }}
                />
              ) : null
            }
            iconPosition="end"
            sx={{
              minHeight: 48,
              py: 0,
              "& .MuiTab-iconWrapper": {
                marginBottom: 0,
              },
            }}
          />
          <Tab
            label="Discussion"
            disabled={!hasAttempted}
            icon={
              !hasAttempted ? (
                <LockIcon
                  fontSize="small"
                  sx={{ height: "15px", width: "15px", mt: "-3px" }}
                />
              ) : null
            }
            iconPosition="end"
            sx={{
              minHeight: 48,
              py: 0,
              "& .MuiTab-iconWrapper": {
                marginBottom: 0,
              },
            }}
          />
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        {/* TAB CONTENT */}

        {/* Quiz Details */}
        {tab === 0 && (
          <Box>
            <Typography>{quiz.description}</Typography>
          </Box>
        )}

        {/* Answers */}
        {tab === 1 && hasAttempted && (
          <Box>
            {resultsLoading && <CircularProgress />}

            {resultsError && <Alert severity="error">{resultsError}</Alert>}

            {results && (
              <>
                <Typography variant="h6" mb={2}>
                  Score: {results.score} / {results.total_questions}
                </Typography>

                {results.questions.map((q, index) => (
                  <Card key={q.question_id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography fontWeight="bold" mb={1}>
                        Q{index + 1}. {q.question_text}
                      </Typography>

                      {q.options.map((option) => {
                        let bgColor = "#fff";

                        if (option.is_correct) bgColor = "#e8f5e9";
                        if (option.selected_by_student && !option.is_correct)
                          bgColor = "#ffebee";

                        return (
                          <Box
                            key={option.option_id}
                            p={1}
                            mb={1}
                            borderRadius={1}
                            sx={{
                              backgroundColor: bgColor,
                              border: "1px solid #ddd",
                            }}
                          >
                            <Typography>
                              {option.option_text}
                              {option.is_correct == 1 && " ✔"}
                              {option.selected_by_student &&
                                !option.is_correct &&
                                " ✖"}
                            </Typography>
                          </Box>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </Box>
        )}

        {/* Discussion */}
        {tab === 2 && hasAttempted && (
          <Box>
            <Typography variant="h6">Discussion</Typography>
            <DiscussionSection quizId={quizId} active={tab === 2} />
          </Box>
        )}
      </Box>
    </Container>
  );
}
