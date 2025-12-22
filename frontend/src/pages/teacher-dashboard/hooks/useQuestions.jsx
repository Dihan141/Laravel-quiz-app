import { useEffect, useState } from "react";
import api from "../../../api";

export function useQuestions(quizId) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!quizId) return;
    api.get(`/teacher/quizzes/${quizId}/questions`).then((res) => {
      setQuestions(res.data.questions);
    });
  }, [quizId]);

  const addQuestion = async (text) => {
    const res = await api.post(`/teacher/quizzes/${quizId}/questions`, {
      question_text: text,
      type: "mcq",
    });
    setQuestions((prev) => [...prev, res.data.question]);
  };

  const updateQuestion = async (id, text) => {
    const res = await api.put(`/teacher/questions/${id}`, {
      question_text: text,
    });
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? res.data.question : q))
    );
  };

  const deleteQuestion = async (id) => {
    await api.delete(`/teacher/questions/${id}`);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return { questions, addQuestion, updateQuestion, deleteQuestion };
}
