import { useParams } from "react-router-dom";
import { CircularProgress, Box, Container } from "@mui/material";
import SummaryCards from "./components/SummaryCards";
import ScoreTable from "./components/ScoreTable";
import { useQuizAnalytics } from "./hooks/useQuizAnalytics";
import TeacherDashboardNavbar from "../../components/TeacherDashboardNavbar";

export default function QuizAnalyticsPage() {
  const { quizId } = useParams();
  const { data, loading } = useQuizAnalytics(quizId);

  if (loading) return <CircularProgress />;
  if (!data) return null;

  return (
    <>
      <TeacherDashboardNavbar title={`${data.quiz.title} Analytics`} />
      <Container sx={{ mt: 2 }}>
        <Box>
          <SummaryCards summary={data.summary} />
          <ScoreTable students={data.students} />
        </Box>
      </Container>
    </>
  );
}
