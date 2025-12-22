import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function ScoreTable({ students }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student</TableCell>
          <TableCell>Score</TableCell>
          <TableCell>Submitted At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.name}</TableCell>
            <TableCell>{s.score}</TableCell>
            <TableCell>{s.submitted_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
