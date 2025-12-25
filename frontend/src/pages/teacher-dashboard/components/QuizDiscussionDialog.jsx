import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { useQuizDiscussions } from "../../../hooks/useQuizDiscussions";
import { stringToColor } from "../../../helpers/AssignAvatarColor";

export default function QuizDiscussionDialog({ open, onClose, quiz }) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  const { discussions, loading, posting, postDiscussion } = useQuizDiscussions(
    quiz.id,
    open
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [discussions]);

  const handleSend = async () => {
    if (!message.trim()) return;

    await postDiscussion(message);
    setMessage("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Discussion – {quiz.title}</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : discussions.length === 0 ? (
          <Typography color="text.secondary">No discussions yet.</Typography>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            maxHeight={400}
            overflow="auto"
            ref={scrollRef}
          >
            {discussions.map((d) => (
              <Box key={d.id}>
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
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Reply as teacher..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={posting}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <Button
          onClick={handleSend}
          disabled={posting || !message.trim()}
          endIcon={<SendIcon />}
        >
          {posting ? "Sending..." : "Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
