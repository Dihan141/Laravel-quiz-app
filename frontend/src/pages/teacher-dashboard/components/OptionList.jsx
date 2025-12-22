import {
  Box,
  Checkbox,
  Button,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useOptions } from "../hooks/useOptions";
import { useState } from "react";

export default function OptionList({ questionId }) {
  const { options, addOption, updateOption, deleteOption } =
    useOptions(questionId);

  //ADD OPTIOM STATE
  const [text, setText] = useState("");
  const [correct, setCorrect] = useState(false);

  // EDIT OPTION STATE
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editCorrect, setEditCorrect] = useState(false);

  const resetInput = () => {
    setText("");
    setCorrect(false);
  };

  const startEdit = (option) => {
    setEditingId(option.id);
    setEditText(option.option_text);
    setEditCorrect(option.is_correct);
  };

  const saveEdit = async () => {
    await updateOption(editingId, editText, editCorrect);
    setEditingId(null);
  };

  return (
    <Box ml={2}>
      {options.map((o) => (
        <Box key={o.id} display="flex" alignItems="center" gap={1}>
          {editingId === o.id ? (
            <>
              <TextField
                size="small"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />

              <Box display="flex" alignItems="center">
                <Checkbox
                  checked={editCorrect}
                  onChange={(e) => setEditCorrect(e.target.checked)}
                />
                <Typography variant="body2">Is Correct</Typography>
              </Box>
              <Button size="small" onClick={saveEdit}>
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography>
                {o.option_text} {o.is_correct == 1 && "✔"}
              </Typography>

              <IconButton onClick={() => startEdit(o)}>
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => deleteOption(o.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      ))}

      <Box mt={1} display="flex" alignItems="center" gap={1}>
        <TextField
          size="small"
          placeholder="New option"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Box display="flex" alignItems="center">
          <Checkbox
            checked={correct}
            onChange={(e) => setCorrect(e.target.checked)}
          />
          <Typography variant="body2">Is correct</Typography>
        </Box>
        <Button
          onClick={() => {
            addOption(text, correct);
            resetInput();
          }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
