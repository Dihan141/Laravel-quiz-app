import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimerIcon from "@mui/icons-material/Timer";
import { useNavigate } from "react-router-dom";

export default function QuizList({ quizzes, onTogglePublish, onManage }) {
  const navigate = useNavigate();
  return (
    <Grid container spacing={2}>
      {quizzes.map((quiz) => (
        <Grid item xs={12} md={4} key={quiz.id}>
          <Card>
            <CardContent>
              <Box display="flex">
                <Typography sx={{ flex: 1 }} variant="h6">
                  {quiz.title}
                </Typography>
                <IconButton
                  sx={{ mt: -0.5 }}
                  onClick={() =>
                    navigate(`/teacher/quizzes/${quiz.id}/analytics`)
                  }
                >
                  <BarChartIcon />
                </IconButton>
              </Box>

              <Box display="flex" gap={1} sx={{ mt: 1, mb: 1 }}>
                <TimerIcon sx={{ color: "text.secondary" }} />
                <Typography>{quiz.time_limit} min</Typography>
              </Box>

              <Button size="small" onClick={() => onTogglePublish(quiz)}>
                {quiz.is_published ? "Unpublish" : "Publish"}
              </Button>

              <Button size="small" onClick={() => onManage(quiz)}>
                Manage Questions
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
