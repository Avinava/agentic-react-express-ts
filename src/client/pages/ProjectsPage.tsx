import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { ProjectForm } from '../components/ProjectForm.js';
import { trpc } from '../trpc.js';

export function ProjectsPage() {
  const utils = trpc.useUtils();
  const list = trpc.project.list.useQuery();
  const create = trpc.project.create.useMutation({
    onSuccess: () => {
      toast.success('Project created');
      void utils.project.list.invalidate();
    },
  });
  const update = trpc.project.update.useMutation({
    onSuccess: () => {
      toast.success('Project updated');
      void utils.project.list.invalidate();
    },
  });
  const del = trpc.project.delete.useMutation({
    onSuccess: () => {
      toast.success('Project deleted');
      void utils.project.list.invalidate();
    },
  });

  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const editing = list.data?.find((p) => p.id === editingId) ?? null;

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Projects</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => setEditingId('new')}>
          New project
        </Button>
      </Stack>

      {list.data && list.data.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No projects yet.</Box>
      )}

      <Grid container spacing={2}>
        {list.data?.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{p.name}</Typography>
                  <Chip size="small" label={p.status} color="primary" variant="outlined" />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, minHeight: 48 }}>
                  {p.description ?? '—'}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Chip size="small" label={`${String(p._count.tasks)} tasks`} />
                  <Chip size="small" label={`${String(p._count.members)} members`} />
                </Stack>
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                  <IconButton size="small" onClick={() => setEditingId(p.id)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (window.confirm(`Delete project "${p.name}"?`)) del.mutate({ id: p.id });
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={editingId !== null} onClose={() => setEditingId(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId === 'new' ? 'New project' : 'Edit project'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ProjectForm
              defaultValues={
                editing
                  ? {
                      name: editing.name,
                      description: editing.description ?? '',
                      status: editing.status,
                    }
                  : undefined
              }
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
