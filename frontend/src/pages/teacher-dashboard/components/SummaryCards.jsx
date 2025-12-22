import { Grid, Card, CardContent, Typography } from "@mui/material";

export default function SummaryCards({ summary }) {
  return (
    <Grid container spacing={2} mb={3}>
      {["attempts", "average", "min", "max"].map((key) => (
        <Grid item xs={12} md={3} key={key}>
          <Card>
            <CardContent>
              <Typography variant="h6">{key.toUpperCase()}</Typography>
              <Typography variant="h4">{summary[key]}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
