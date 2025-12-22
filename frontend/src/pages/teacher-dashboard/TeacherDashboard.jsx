import { useState } from "react";
import { Box, Container } from "@mui/material";
import TeacherDashboardNavbar from "../../components/TeacherDashboardNavbar";
import QuizTabs from "./components/QuizTabs";
import CreateQuizForm from "./components/CreateQuizForm";
import QuizList from "./components/QuizList";
import QuestionDialog from "./components/QuestionDialog";
import { useQuizzes } from "./hooks/useQuizzes";

export default function TeacherDashboard() {
  const [tab, setTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const { activeQuizzes, inactiveQuizzes, togglePublish, createQuiz } =
    useQuizzes();

  return (
    <Box>
      <TeacherDashboardNavbar title={"Teacher Dashboard"} />
      <Container sx={{ py: 3 }}>
        <QuizTabs value={tab} onChange={setTab} />

        {tab === 0 && (
          <CreateQuizForm
            onCreate={async (data, resetForm) => {
              await createQuiz(data);
              resetForm(); // 👈 clear inputs
            }}
          />
        )}

        {(tab === 1 || tab === 2) && (
          <QuizList
            quizzes={tab === 1 ? activeQuizzes : inactiveQuizzes}
            onTogglePublish={togglePublish}
            onManage={(quiz) => {
              setCurrentQuiz(quiz);
              setOpenDialog(true);
            }}
          />
        )}

        <QuestionDialog
          open={openDialog}
          quiz={currentQuiz}
          onClose={() => setOpenDialog(false)}
        />
      </Container>
    </Box>
  );
}
