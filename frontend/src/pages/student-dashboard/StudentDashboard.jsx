import StudentDashboardNavbar from "../../components/StudentDashboardNavbar";
import Person4Icon from "@mui/icons-material/Person4";
import TimerIcon from "@mui/icons-material/Timer";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");

  const { data, error, loading } = useFetch("/student/quizzes");

  const allQuizzes = data?.data || [];

  // Filter attempted quizzes dynamically
  const attemptedQuizzes = allQuizzes.filter((quiz) => quiz.has_attempted);

  const quizzesToShow = selectedTab === "all" ? allQuizzes : attemptedQuizzes;

  return (
    <Box>
      {/* Top Navbar */}
      <StudentDashboardNavbar />

      {/* Main content area */}
      <Container>
        <Box display="flex" mt={2}>
          {/* Side Menu */}
          <Box
            width={200}
            p={2}
            borderRight="1px solid #ddd"
            display="flex"
            flexDirection="column"
            gap={1}
          >
            <Button
              variant={selectedTab === "all" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("all")}
            >
              All Quizzes
            </Button>

            <Button
              variant={selectedTab === "attempted" ? "contained" : "outlined"}
              onClick={() => setSelectedTab("attempted")}
            >
              Attempted Quizzes
            </Button>
          </Box>

          {/* Content */}
          <Box flex={1} p={2}>
            <Typography variant="h6" mb={2}>
              {selectedTab === "all" ? "All Quizzes" : "Attempted Quizzes"}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Loading & Error */}
            {loading && (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && quizzesToShow.length > 0 && (
              <Grid container spacing={2}>
                {quizzesToShow.map((quiz) => (
                  <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                    <Card
                      sx={{
                        height: 250,
                        width: 250,
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6">{quiz.title}</Typography>
                          <Box display="flex" gap={1} sx={{ mt: 1 }}>
                            <Person4Icon sx={{ color: "text.secondary" }} />
                            <Typography color="text.secondary">
                              {quiz.teacher_name}
                            </Typography>
                          </Box>

                          <Box display="flex" gap={1} sx={{ mt: 1 }}>
                            <TimerIcon sx={{ color: "text.secondary" }} />
                            <Typography color="text.secondary">
                              {quiz.time_limit} Minutes
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          sx={{ mt: 1 }}
                          fullWidth
                          onClick={() =>
                            navigate(`/student-quiz-detail/${quiz.id}`)
                          }
                        >
                          See Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {!loading && !error && quizzesToShow.length === 0 && (
              <Typography>No quizzes found.</Typography>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default StudentDashboard;
