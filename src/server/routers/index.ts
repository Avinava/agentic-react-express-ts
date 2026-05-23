import { router } from '../trpc.js';

import { contactRouter } from './contact.js';
import { projectRouter } from './project.js';
import { taskRouter } from './task.js';

export const appRouter = router({
  contact: contactRouter,
  task: taskRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
