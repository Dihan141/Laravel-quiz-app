import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useQuestions } from "../hooks/useQuestions";
import QuestionItem from "./QuestionItem";

export default function QuestionDialog({ open, quiz, onClose }) {
  const { questions, addQuestion, updateQuestion, deleteQuestion } =
    useQuestions(quiz?.id);

  const [text, setText] = useState("");

  const resetInput = () => {
    setText("");
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle>{quiz?.title}</DialogTitle>
      <DialogContent>
        <TextField
          required
          fullWidth
          placeholder="New question"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          onClick={() => {
            addQuestion(text);
            resetInput();
          }}
        >
          Add Question
        </Button>

        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
