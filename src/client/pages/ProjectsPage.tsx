import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  TuneOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { PageHeader } from '../components/AppShell.js';
import { ProjectForm } from '../components/ProjectForm.js';
import { avatarColor, avatarInitials } from '../lib/avatar.js';
import { ORBIT_TOKENS } from '../theme/theme.js';
import { trpc } from '../trpc.js';

const fmtShort = (d: Date | string | null | undefined): string => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const STATUS_COLOR: Record<string, 'default' | 'success' | 'info' | 'warning'> = {
  active: 'success',
  planning: 'info',
  paused: 'warning',
  completed: 'default',
};

export function ProjectsPage() {
  const utils = trpc.useUtils();
  const list = trpc.project.list.useQuery();
  const tasks = trpc.task.list.useQuery();
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
  const projects = list.data ?? [];
  const taskList = tasks.data ?? [];

  return (
    <Stack spacing={0}>
      <PageHeader
        crumb="Workspace"
        title="Projects"
        subtitle="Initiatives in flight — track progress, ownership, and timelines."
        actions={
          <>
            <Button variant="outlined" startIcon={<TuneOutlined fontSize="small" />}>
              Filter
            </Button>
            <Button
              variant="contained"
              startIcon={<AddOutlined fontSize="small" />}
              onClick={() => setEditingId('new')}
            >
              New project
            </Button>
          </>
        }
      />

      <Tabs value={0} sx={{ mb: 2.5 }}>
        <Tab label={`All  ${String(projects.length)}`} />
      </Tabs>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 2,
        }}
      >
        {projects.map((p) => {
          const total = p._count.tasks;
          const doneInProject = taskList.filter(
            (t) => t.project?.id === p.id && t.status === 'DONE',
          ).length;
          const pct = total === 0 ? 0 : Math.round((doneInProject / total) * 100);
          return (
            <Card key={p.id}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 0.75,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.25,
                        bgcolor: ORBIT_TOKENS.primarySoft,
                        color: ORBIT_TOKENS.primary,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FolderOutlined fontSize="small" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: ORBIT_TOKENS.ink[900],
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {p.name}
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: ORBIT_TOKENS.ink[500], mt: '1px' }}>
                        {fmtShort(p.startDate)} → {fmtShort(p.endDate)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
                    <IconButton size="small" aria-label="Edit" onClick={() => setEditingId(p.id)}>
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Delete"
                      sx={{ '&:hover': { color: '#DC2626', bgcolor: '#FEE2E2' } }}
                      onClick={() => {
                        if (window.confirm(`Delete project "${p.name}"?`)) del.mutate({ id: p.id });
                      }}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: ORBIT_TOKENS.ink[600],
                    lineHeight: 1.5,
                    my: 1.5,
                    minHeight: 38,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                  }}
                >
                  {p.description ?? '—'}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.75,
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: ORBIT_TOKENS.ink[600], fontWeight: 500 }}>
                    Progress
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: ORBIT_TOKENS.ink[900],
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {pct}%
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={pct} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    pt: 1.75,
                    borderTop: `1px solid ${ORBIT_TOKENS.ink[100]}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <AvatarGroup
                      max={3}
                      sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: 9.5 } }}
                    >
                      {p.members.map((m) => {
                        const full = `${m.contact.firstName} ${m.contact.lastName}`;
                        return (
                          <Avatar key={m.id} sx={{ bgcolor: avatarColor(full) }}>
                            {avatarInitials(full)}
                          </Avatar>
                        );
                      })}
                    </AvatarGroup>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: ORBIT_TOKENS.ink[500],
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {doneInProject}/{total} task{total === 1 ? '' : 's'}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    color={STATUS_COLOR[p.status] ?? 'default'}
                    label={p.status}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </CardContent>
            </Card>
          );
        })}

        {/* Empty add card */}
        <Box
          component="button"
          onClick={() => setEditingId('new')}
          sx={{
            background: 'transparent',
            border: `1.5px dashed ${ORBIT_TOKENS.ink[200]}`,
            borderRadius: 1.25,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: ORBIT_TOKENS.ink[500],
            cursor: 'pointer',
            font: 'inherit',
            fontSize: 13.5,
            fontWeight: 500,
            minHeight: 200,
            transition: 'border-color 100ms, color 100ms, background 100ms',
            '&:hover': {
              borderColor: ORBIT_TOKENS.primary,
              color: ORBIT_TOKENS.primary,
              bgcolor: ORBIT_TOKENS.primarySoft,
            },
          }}
        >
          <AddOutlined fontSize="small" /> New project
        </Box>
      </Box>

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
