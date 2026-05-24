import { Route, Routes } from 'react-router-dom';

import { AppShell } from './components/AppShell.js';
import { ContactsPage } from './pages/ContactsPage.js';
import { HomePage } from './pages/HomePage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { TasksPage } from './pages/TasksPage.js';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </AppShell>
  );
}
