import { useEffect, useState } from "react";
import api from "../../../api";

export function useOptions(questionId) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!questionId) return;
    api
      .get(`/teacher/questions/${questionId}/options`)
      .then((res) => setOptions(res.data.options || []));
  }, [questionId]);

  const addOption = async (text, isCorrect) => {
    const res = await api.post(`/teacher/questions/${questionId}/options`, {
      option_text: text,
      is_correct: isCorrect,
    });
    setOptions((prev) => [...prev, res.data.option]);
  };

  const updateOption = async (id, text, isCorrect) => {
    const res = await api.put(`/teacher/options/${id}`, {
      option_text: text,
      is_correct: isCorrect,
    });
    setOptions((prev) => prev.map((o) => (o.id === id ? res.data.option : o)));
  };

  const deleteOption = async (id) => {
    await api.delete(`/teacher/options/${id}`);
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  return { options, addOption, updateOption, deleteOption };
}
