import { Box, Grid, Paper, Typography } from "@mui/material";

const summaryCards = [
  {
    title: "Total Applications",
    value: 1250,
  },
  {
    title: "Pending Applications",
    value: 85,
  },
  {
    title: "Pending Assessments",
    value: 42,
  },
  {
    title: "Approved Applications",
    value: 980,
  },
];

export default function CreditDashboard() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Credit Management Dashboard
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Overview of credit applications and operations.
      </Typography>

      <Grid container spacing={2}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #EAECF0" }}>
              <Typography color="text.secondary" variant="body2">
                {card.title}
              </Typography>

              <Typography variant="h4" fontWeight={700} mt={1}>
                {card.value.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}