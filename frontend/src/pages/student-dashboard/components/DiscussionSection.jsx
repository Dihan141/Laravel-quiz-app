import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useEffect, useRef } from "react";
import { useQuizDiscussions } from "../../../hooks/useQuizDiscussions";
import { stringToColor } from "../../../helpers/AssignAvatarColor";

export default function DiscussionSection({ quizId, active }) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  const { discussions, loading, posting, postDiscussion } = useQuizDiscussions(
    quizId,
    active
  );

  const handleSend = async () => {
    if (!message.trim()) return;
    await postDiscussion(message);
    setMessage("");
  };

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [discussions]);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box
        ref={scrollRef}
        maxHeight={300}
        overflow="auto"
        border="1px solid #ddd"
        borderRadius={1}
        p={2}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : discussions.length === 0 ? (
          <Typography color="text.secondary">No discussions yet.</Typography>
        ) : (
          discussions.map((d) => (
            <Box key={d.id} mb={2}>
              <Box display="flex" gap={1}>
                <Avatar sx={{ bgcolor: stringToColor(d.user) }}>
                  {d.user[0].charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6">{d.user}</Typography>
              </Box>
              <Typography sx={{ ml: 6 }} variant="body2">
                {d.text}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))
        )}
      </Box>

      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={posting}
        />
        <Button
          onClick={handleSend}
          disabled={posting || !message.trim()}
          endIcon={<SendIcon />}
        >
          {posting ? "Sending..." : "Send"}
        </Button>
      </Box>
    </Box>
  );
}
