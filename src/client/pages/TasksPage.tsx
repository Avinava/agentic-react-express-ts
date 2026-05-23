import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { TaskForm } from '../components/TaskForm.js';
import { trpc } from '../trpc.js';

import type { TaskInput, TaskPriorityType, TaskStatusType } from '../../shared/schemas/index.js';

const PRIORITY_COLOR: Record<TaskPriorityType, 'default' | 'info' | 'warning' | 'error'> = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'error',
};

const STATUS_COLOR: Record<TaskStatusType, 'default' | 'info' | 'secondary' | 'success'> = {
  TODO: 'default',
  IN_PROGRESS: 'info',
  REVIEW: 'secondary',
  DONE: 'success',
};

export function TasksPage() {
  const utils = trpc.useUtils();
  const list = trpc.task.list.useQuery();
  const create = trpc.task.create.useMutation({
    onSuccess: () => {
      toast.success('Task created');
      void utils.task.list.invalidate();
    },
  });
  const update = trpc.task.update.useMutation({
    onSuccess: () => {
      toast.success('Task updated');
      void utils.task.list.invalidate();
    },
  });
  const del = trpc.task.delete.useMutation({
    onSuccess: () => {
      toast.success('Task deleted');
      void utils.task.list.invalidate();
    },
  });

  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const editing = list.data?.find((t) => t.id === editingId) ?? null;

  const editingDefaults: Partial<TaskInput> | undefined = editing
    ? {
        title: editing.title,
        description: editing.description ?? '',
        status: editing.status,
        priority: editing.priority,
        dueDate: editing.dueDate,
        assigneeId: editing.assigneeId,
        projectId: editing.projectId,
      }
    : undefined;

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Tasks</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => setEditingId('new')}>
          New task
        </Button>
      </Stack>

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Project</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.data?.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.title}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={STATUS_COLOR[t.status]}
                    label={t.status.replace('_', ' ')}
                  />
                </TableCell>
                <TableCell>
                  <Chip size="small" color={PRIORITY_COLOR[t.priority]} label={t.priority} />
                </TableCell>
                <TableCell>
                  {t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : '—'}
                </TableCell>
                <TableCell>{t.project?.name ?? '—'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditingId(t.id)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (window.confirm(`Delete "${t.title}"?`)) del.mutate({ id: t.id });
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {list.data && list.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                    No tasks yet.
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={editingId !== null} onClose={() => setEditingId(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId === 'new' ? 'New task' : 'Edit task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TaskForm
              defaultValues={editingDefaults}
              submitting={create.isPending || update.isPending}
              submitLabel={editingId === 'new' ? 'Create' : 'Update'}
              onSubmit={(data) => {
                if (editingId === 'new') {
                  create.mutate(data, { onSuccess: () => setEditingId(null) });
                } else if (typeof editingId === 'number') {
                  update.mutate(
                    { id: editingId, ...data },
                    { onSuccess: () => setEditingId(null) },
                  );
                }
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
