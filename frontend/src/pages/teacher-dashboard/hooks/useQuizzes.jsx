import { useEffect, useState } from "react";
import api from "../../../api";

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api.get("/teacher/quizzes").then((res) => {
      setQuizzes(res.data.data);
    });
  }, []);

  const togglePublish = async (quiz) => {
    const res = await api.put(`/teacher/quizzes/${quiz.id}`, {
      is_published: !quiz.is_published,
    });

    setQuizzes((prev) =>
      prev.map((q) => (q.id === quiz.id ? res.data.quiz : q))
    );
  };

  const createQuiz = async (data) => {
    const res = await api.post("/teacher/quizzes", data);
    setQuizzes((prev) => [...prev, res.data.quiz]);
  };

  return {
    quizzes,
    activeQuizzes: quizzes.filter((q) => q.is_published),
    inactiveQuizzes: quizzes.filter((q) => !q.is_published),
    togglePublish,
    createQuiz,
  };
}
