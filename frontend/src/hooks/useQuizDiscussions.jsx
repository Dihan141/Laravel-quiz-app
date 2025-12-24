import { useEffect, useState } from "react";
import api from "../api";

export const useQuizDiscussions = (quizId, open) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!quizId || !open) return;

    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/quizzes/${quizId}/discussions`);
        setDiscussions(res.data);
      } catch (err) {
        console.error("Failed to load discussions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [quizId, open]);

  const postDiscussion = async (message) => {
    setPosting(true);
    try {
      const res = await api.post(`/quizzes/${quizId}/discussions`, {
        message,
      });

      // optimistic append
      setDiscussions((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error("Failed to post discussion", err);
    } finally {
      setPosting(false);
    }
  };

  return {
    discussions,
    loading,
    posting,
    postDiscussion,
  };
};
