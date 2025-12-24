import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimerIcon from "@mui/icons-material/Timer";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import QuizDiscussionDialog from "./QuizDiscussionDialog";

export default function QuizList({ quizzes, onTogglePublish, onManage }) {
  const navigate = useNavigate();
  const [openDiscussion, setOpenDiscussion] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);

  const handleOpenDiscussion = (quiz) => {
    setActiveQuiz(quiz);
    setOpenDiscussion(true);
  };

  return (
    <>
      <Stack spacing={2}>
        {quizzes.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            No quizzes available.
          </Typography>
        ) : (
          quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {/* Left */}
                  <Box>
                    <Typography variant="h6">{quiz.title}</Typography>

                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <TimerIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {quiz.time_limit} min
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right actions */}
                  <Box display="flex" gap={1}>
                    <Tooltip title="See Analytics">
                      <IconButton
                        onClick={() =>
                          navigate(`/teacher/quizzes/${quiz.id}/analytics`)
                        }
                      >
                        <BarChartIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Discussions">
                      <IconButton onClick={() => handleOpenDiscussion(quiz)}>
                        <ForumIcon />
                      </IconButton>
                    </Tooltip>

                    <Button size="small" onClick={() => onTogglePublish(quiz)}>
                      {quiz.is_published ? "Unpublish" : "Publish"}
                    </Button>

                    <Button size="small" onClick={() => onManage(quiz)}>
                      Manage
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Discussion dialog */}
      {activeQuiz && (
        <QuizDiscussionDialog
          open={openDiscussion}
          onClose={() => setOpenDiscussion(false)}
          quiz={activeQuiz}
        />
      )}
    </>
  );
}
