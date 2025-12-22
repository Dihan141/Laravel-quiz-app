import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import { useAuthContext } from "./hooks/useAuthContext";
import StudentDashboard from "./pages/studentDashboard";
import TeacherDashboard from "./pages/teacher-dashboard/TeacherDashboard";
import StudentQuizDetail from "./pages/StudentQuizDetail";
import QuizAttempt from "./pages/QuizAttempt";
import QuizAnalyticsPage from "./pages/teacher-dashboard/QuizAnalyticsPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#73598dff",
    },
  },
});

function RequireRole({ role, children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.user.roles[0] !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user, loading } = useAuthContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Student */}
          <Route
            path="/student-dashboard"
            element={
              <RequireRole role="student">
                <StudentDashboard />
              </RequireRole>
            }
          />

          <Route
            path="/student-quiz-detail/:id"
            element={
              <RequireRole role="student">
                <StudentQuizDetail />
              </RequireRole>
            }
          />

          <Route
            path="/quiz/:quizId/start"
            element={
              <RequireRole role="student">
                <QuizAttempt />
              </RequireRole>
            }
          />

          {/* Teacher */}
          <Route
            path="/teacher-dashboard"
            element={
              <RequireRole role="teacher">
                <TeacherDashboard />
              </RequireRole>
            }
          />

          <Route
            path="/teacher/quizzes/:quizId/analytics"
            element={
              <RequireRole role="teacher">
                <QuizAnalyticsPage />
              </RequireRole>
            }
          />

          {/* Auth */}
          <Route
            path="/"
            element={
              loading ? (
                <div>Loading...</div>
              ) : !user ? (
                <Login />
              ) : (
                <Navigate
                  to={
                    user.user.roles[0] === "student"
                      ? "/student-dashboard"
                      : "/teacher-dashboard"
                  }
                  replace
                />
              )
            }
          />

          <Route
            path="/login"
            element={
              loading ? (
                <div>Loading...</div>
              ) : !user ? (
                <Login />
              ) : (
                <Navigate
                  to={
                    user.user.roles[0] === "student"
                      ? "/student-dashboard"
                      : "/teacher-dashboard"
                  }
                  replace
                />
              )
            }
          />

          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
