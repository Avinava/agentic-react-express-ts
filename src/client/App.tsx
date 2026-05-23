import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';

import { ContactsPage } from './pages/ContactsPage.js';
import { HomePage } from './pages/HomePage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { TasksPage } from './pages/TasksPage.js';

export function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 700, mr: 2 }}
          >
            agentic-react-express-ts
          </Typography>
          <Button component={Link} to="/contacts" color="inherit">
            Contacts
          </Button>
          <Button component={Link} to="/tasks" color="inherit">
            Tasks
          </Button>
          <Button component={Link} to="/projects" color="inherit">
            Projects
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
