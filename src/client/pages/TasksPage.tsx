import {
  AddOutlined,
  CalendarTodayOutlined,
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
  TuneOutlined,
  ViewKanbanOutlined,
  ViewListOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { PageHeader } from '../components/AppShell.js';
import { TaskForm } from '../components/TaskForm.js';
import { avatarColor, avatarInitials } from '../lib/avatar.js';
import { ORBIT_TOKENS } from '../theme/theme.js';
import { trpc } from '../trpc.js';

import type { TaskInput, TaskPriorityType, TaskStatusType } from '../../shared/schemas/index.js';

const STATUS_META: Record<
  TaskStatusType,
  { label: string; color: 'default' | 'info' | 'warning' | 'success'; accent: string }
> = {
  TODO: { label: 'To do', color: 'default', accent: ORBIT_TOKENS.ink[400] },
  IN_PROGRESS: { label: 'In progress', color: 'info', accent: '#0EA5E9' },
  REVIEW: { label: 'In review', color: 'warning', accent: '#D97706' },
  DONE: { label: 'Done', color: 'success', accent: '#10A56F' },
};

const PRIORITY_META: Record<
  TaskPriorityType,
  { label: string; color: 'default' | 'info' | 'warning' | 'error' }
> = {
  LOW: { label: 'Low', color: 'default' },
  MEDIUM: { label: 'Medium', color: 'info' },
  HIGH: { label: 'High', color: 'warning' },
  URGENT: { label: 'Urgent', color: 'error' },
};

const STATUS_ORDER: TaskStatusType[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

const fmtShort = (d: Date | string | null | undefined): string => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

type TaskRow = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatusType;
  priority: TaskPriorityType;
  dueDate: Date | null;
  assignee: { id: number; firstName: string; lastName: string } | null;
  project: { id: number; name: string } | null;
};

function ViewToggle({
  view,
  onChange,
}: {
  view: 'board' | 'list';
  onChange: (v: 'board' | 'list') => void;
}) {
  const opts = [
    { id: 'board' as const, label: 'Board', icon: <ViewKanbanOutlined sx={{ fontSize: 16 }} /> },
    { id: 'list' as const, label: 'List', icon: <ViewListOutlined sx={{ fontSize: 16 }} /> },
  ];
  return (
    <Box
      sx={{
        display: 'inline-flex',
        bgcolor: ORBIT_TOKENS.ink[100],
        borderRadius: 1.5,
        p: '3px',
        gap: '2px',
      }}
    >
      {opts.map((v) => (
        <Box
          key={v.id}
          component="button"
          onClick={() => onChange(v.id)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.625,
            fontSize: 12.5,
            fontWeight: 500,
            bgcolor: view === v.id ? '#fff' : 'transparent',
            color: view === v.id ? ORBIT_TOKENS.ink[900] : ORBIT_TOKENS.ink[600],
            border: 'none',
            px: 1.25,
            py: 0.625,
            borderRadius: 1,
            cursor: 'pointer',
            boxShadow: view === v.id ? ORBIT_TOKENS.shadow.sm : 'none',
            fontFamily: 'inherit',
          }}
        >
          {v.icon}
          {v.label}
        </Box>
      ))}
    </Box>
  );
}

function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: TaskRow;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const meta = STATUS_META[task.status];
  const pri = PRIORITY_META[task.priority];
  const assigneeName = task.assignee
    ? `${task.assignee.firstName} ${task.assignee.lastName}`
    : null;
  return (
    <Card
      sx={{
        '&:hover': {
          boxShadow: ORBIT_TOKENS.shadow.md,
          borderColor: ORBIT_TOKENS.ink[300],
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.25,
          }}
        >
          <Chip size="small" color={meta.color} label={meta.label} />
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            <IconButton size="small" aria-label="Edit" onClick={() => onEdit(task.id)}>
              <EditOutlined fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Delete"
              sx={{ '&:hover': { color: '#DC2626', bgcolor: '#FEE2E2' } }}
              onClick={() => onDelete(task.id)}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: 14.5,
            fontWeight: 600,
            color: ORBIT_TOKENS.ink[900],
            letterSpacing: '-0.005em',
            lineHeight: 1.35,
            mb: 0.75,
          }}
        >
          {task.title}
        </Typography>
        {task.description && (
          <Typography
            sx={{
              fontSize: 12.5,
              color: ORBIT_TOKENS.ink[500],
              lineHeight: 1.5,
              mb: 1.75,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {task.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            size="small"
            variant="outlined"
            color={pri.color}
            icon={<FlagOutlined sx={{ fontSize: '14px !important' }} />}
            label={pri.label}
          />
          <Chip
            size="small"
            variant="outlined"
            icon={<CalendarTodayOutlined sx={{ fontSize: '14px !important' }} />}
            label={fmtShort(task.dueDate)}
          />
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1.5,
            borderTop: `1px solid ${ORBIT_TOKENS.ink[100]}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            {assigneeName ? (
              <Avatar
                sx={{
                  width: 22,
                  height: 22,
                  fontSize: 9.5,
                  bgcolor: avatarColor(assigneeName),
                }}
              >
                {avatarInitials(assigneeName)}
              </Avatar>
            ) : (
              <Avatar
                sx={{
                  width: 22,
                  height: 22,
                  fontSize: 9.5,
                  bgcolor: ORBIT_TOKENS.ink[200],
                  color: ORBIT_TOKENS.ink[600],
                }}
              >
                ?
              </Avatar>
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: ORBIT_TOKENS.ink[800],
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {assigneeName ?? 'Unassigned'}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: ORBIT_TOKENS.ink[500],
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {task.project?.name ?? 'No project'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Board({
  tasks,
  onEdit,
  onDelete,
}: {
  tasks: TaskRow[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1.75,
        alignItems: 'flex-start',
      }}
    >
      {STATUS_ORDER.map((s) => {
        const col = STATUS_META[s];
        const items = tasks.filter((t) => t.status === s);
        return (
          <Stack key={s} spacing={1.25}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 0.5,
                pb: 0.75,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: col.accent,
                    display: 'inline-block',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: ORBIT_TOKENS.ink[800],
                    letterSpacing: '0.01em',
                  }}
                >
                  {col.label}
                </Typography>
                <Box
                  sx={{
                    fontSize: 11.5,
                    color: ORBIT_TOKENS.ink[500],
                    bgcolor: ORBIT_TOKENS.ink[100],
                    px: 0.875,
                    py: '1px',
                    borderRadius: 999,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {items.length}
                </Box>
              </Box>
              <Tooltip title="Add">
                <IconButton size="small" aria-label="Add">
                  <AddOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            {items.map((t) => (
              <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {items.length === 0 && (
              <Box
                sx={{
                  border: `1px dashed ${ORBIT_TOKENS.ink[200]}`,
                  borderRadius: 1.5,
                  p: 2,
                  fontSize: 12,
                  color: ORBIT_TOKENS.ink[500],
                  textAlign: 'center',
                }}
              >
                Nothing here
              </Box>
            )}
          </Stack>
        );
      })}
    </Box>
  );
}

function ListView({
  tasks,
  onEdit,
  onDelete,
}: {
  tasks: TaskRow[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '36%' }}>Task</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Due</TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell sx={{ width: 100 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((t) => {
            const meta = STATUS_META[t.status];
            const pri = PRIORITY_META[t.priority];
            const assigneeName = t.assignee
              ? `${t.assignee.firstName} ${t.assignee.lastName}`
              : null;
            return (
              <TableRow key={t.id}>
                <TableCell>
                  <Typography
                    sx={{ fontWeight: 500, color: ORBIT_TOKENS.ink[900], fontSize: 13.5 }}
                  >
                    {t.title}
                  </Typography>
                  {t.description && (
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: ORBIT_TOKENS.ink[500],
                        maxWidth: 360,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip size="small" color={meta.color} label={meta.label} />
                </TableCell>
                <TableCell>
                  <Chip size="small" variant="outlined" color={pri.color} label={pri.label} />
                </TableCell>
                <TableCell
                  sx={{ color: ORBIT_TOKENS.ink[500], fontVariantNumeric: 'tabular-nums' }}
                >
                  {fmtShort(t.dueDate)}
                </TableCell>
                <TableCell sx={{ color: ORBIT_TOKENS.ink[500] }}>
                  {t.project?.name ?? '—'}
                </TableCell>
                <TableCell>
                  {assigneeName ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 22,
                          height: 22,
                          fontSize: 9.5,
                          bgcolor: avatarColor(assigneeName),
                        }}
                      >
                        {avatarInitials(assigneeName)}
                      </Avatar>
                      <Typography sx={{ fontSize: 12.5, color: ORBIT_TOKENS.ink[700] }}>
                        {assigneeName}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography sx={{ color: ORBIT_TOKENS.ink[400] }}>—</Typography>
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <Box
                    className="row-actions"
                    sx={{
                      display: 'inline-flex',
                      gap: 0.25,
                      opacity: 0,
                      transition: 'opacity 80ms',
                    }}
                  >
                    <IconButton size="small" onClick={() => onEdit(t.id)} aria-label="Edit">
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Delete"
                      sx={{ '&:hover': { color: '#DC2626', bgcolor: '#FEE2E2' } }}
                      onClick={() => onDelete(t.id)}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>
                <Box sx={{ p: 6, textAlign: 'center', color: ORBIT_TOKENS.ink[500] }}>
                  No tasks yet.
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

export function TasksPage() {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);

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

  const tasks: TaskRow[] = (list.data ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
    assignee: t.assignee
      ? { id: t.assignee.id, firstName: t.assignee.firstName, lastName: t.assignee.lastName }
      : null,
    project: t.project ? { id: t.project.id, name: t.project.name } : null,
  }));

  const editing = tasks.find((t) => t.id === editingId) ?? null;
  const editingDefaults: Partial<TaskInput> | undefined = editing
    ? {
        title: editing.title,
        description: editing.description ?? '',
        status: editing.status,
        priority: editing.priority,
        dueDate: editing.dueDate,
        assigneeId: editing.assignee?.id ?? null,
        projectId: editing.project?.id ?? null,
      }
    : undefined;

  const handleDelete = (id: number) => {
    const t = tasks.find((x) => x.id === id);
    if (t && window.confirm(`Delete "${t.title}"?`)) del.mutate({ id });
  };

  return (
    <Stack spacing={0}>
      <PageHeader
        crumb="Workspace"
        title="Tasks"
        subtitle="Everything that needs doing, across every project."
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
              New task
            </Button>
          </>
        }
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <ViewToggle view={view} onChange={setView} />
      </Box>

      {view === 'board' ? (
        <Board tasks={tasks} onEdit={setEditingId} onDelete={handleDelete} />
      ) : (
        <ListView tasks={tasks} onEdit={setEditingId} onDelete={handleDelete} />
      )}

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
