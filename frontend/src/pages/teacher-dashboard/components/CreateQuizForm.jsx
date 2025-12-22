import { useState } from "react";
import { TextField, Button, Snackbar, Alert } from "@mui/material";

export default function CreateQuizForm({ onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    time_limit: 30,
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      time_limit: 30,
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;

    try {
      setLoading(true);
      await onCreate(form, resetForm);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TextField
        fullWidth
        label="Title"
        sx={{ mb: 2 }}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <TextField
        fullWidth
        label="Description"
        sx={{ mb: 2 }}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <TextField
        fullWidth
        type="number"
        label="Time Limit"
        sx={{ mb: 2 }}
        value={form.time_limit}
        onChange={(e) =>
          setForm({ ...form, time_limit: Number(e.target.value) })
        }
      />

      <Button variant="contained" disabled={loading} onClick={handleSubmit}>
        {loading ? "Creating..." : "Create Quiz"}
      </Button>

      {/* SUCCESS FEEDBACK */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">Quiz created successfully!</Alert>
      </Snackbar>
    </>
  );
}
