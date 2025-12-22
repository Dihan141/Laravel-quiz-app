import { useEffect, useState } from "react";
import api from "../../../api";

export function useQuizAnalytics(quizId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/teacher/quizzes/${quizId}/analytics`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading };
}
