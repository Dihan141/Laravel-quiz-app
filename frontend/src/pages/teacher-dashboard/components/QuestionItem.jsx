import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import OptionList from "./OptionList";

export default function QuestionItem({ question, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(question.question_text);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <Box mt={2} p={1} border="1px solid #ddd">
      {editing ? (
        <>
          <Box display="flex" gap={1}>
            <TextField
              sx={{ flex: 1 }}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              onClick={() => {
                onUpdate(question.id, text);
                setEditing(false);
              }}
            >
              Save
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography>{question.question_text}</Typography>
          <IconButton onClick={() => setEditing(true)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(question.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      )}

      <Button onClick={() => setShowOptions(!showOptions)}>
        Manage Options
      </Button>

      {showOptions && <OptionList questionId={question.id} />}
    </Box>
  );
}
