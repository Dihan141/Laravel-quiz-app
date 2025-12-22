import { Tabs, Tab } from "@mui/material";

export default function QuizTabs({ value, onChange }) {
  return (
    <Tabs value={value} onChange={(e, v) => onChange(v)} sx={{ mb: 3 }}>
      <Tab label="Create Quiz" />
      <Tab label="Active Quizzes" />
      <Tab label="Inactive Quizzes" />
    </Tabs>
  );
}
