import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { trpc } from '../trpc.js';

export function HomePage() {
  const contacts = trpc.contact.list.useQuery();
  const tasks = trpc.task.list.useQuery();
  const projects = trpc.project.list.useQuery();

  const cards = [
    {
      to: '/contacts',
      label: 'Contacts',
      count: contacts.data?.length ?? '—',
      blurb: 'People you work with',
    },
    {
      to: '/tasks',
      label: 'Tasks',
      count: tasks.data?.length ?? '—',
      blurb: 'What needs doing',
    },
    {
      to: '/projects',
      label: 'Projects',
      count: projects.data?.length ?? '—',
      blurb: 'Active initiatives',
    },
  ];

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" gutterBottom>
          agentic-react-express-ts
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720 }}>
          A full-stack TypeScript template for the agentic era. tRPC for end-to-end type safety,
          guardrails baked into every commit, and skill files your AI agent can read directly.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip label="React 19" />
          <Chip label="Vite 7" />
          <Chip label="Express 5" />
          <Chip label="tRPC 11" />
          <Chip label="Prisma 7" />
          <Chip label="Postgres" />
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid key={c.to} size={{ xs: 12, sm: 4 }}>
            <Card
              component={Link}
              to={c.to}
              sx={{
                textDecoration: 'none',
                display: 'block',
                transition: 'transform 120ms',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {c.label}
                </Typography>
                <Typography variant="h3" sx={{ my: 1 }}>
                  {c.count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.blurb}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
