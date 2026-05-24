import {
  AddOutlined,
  AutoAwesomeOutlined,
  CalendarTodayOutlined,
  CheckCircleOutlined,
  CircleOutlined,
  RadioButtonCheckedOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

import { avatarColor, avatarInitials } from '../lib/avatar.js';
import { ORBIT_TOKENS } from '../theme/theme.js';
import { trpc } from '../trpc.js';

import type { TaskPriorityType, TaskStatusType } from '../../shared/schemas/index.js';

const PRIORITY_COLOR: Record<TaskPriorityType, 'default' | 'info' | 'warning' | 'error'> = {
  LOW: 'default',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'error',
};

const STATUS_ICON_COLOR: Record<TaskStatusType, string> = {
  TODO: ORBIT_TOKENS.ink[400],
  IN_PROGRESS: '#0EA5E9',
  REVIEW: '#D97706',
  DONE: '#10A56F',
};

function StatusIcon({ status }: { status: TaskStatusType }) {
  const sx = { color: STATUS_ICON_COLOR[status], fontSize: 18 };
  if (status === 'DONE') return <CheckCircleOutlined sx={sx} />;
  if (status === 'IN_PROGRESS') return <RadioButtonCheckedOutlined sx={sx} />;
  if (status === 'REVIEW') return <RadioButtonCheckedOutlined sx={sx} />;
  return <CircleOutlined sx={sx} />;
}

const fmtShort = (d: Date | string | null | undefined): string => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

function StatCard({
  label,
  value,
  hint,
  hintColor,
  progress,
}: {
  label: string;
  value: string | number;
  hint?: string;
  hintColor?: 'success' | 'muted';
  progress?: number;
}) {
  return (
    <Card sx={{ flex: 1, minWidth: 0 }}>
      <CardContent>
        <Typography variant="overline">{label}</Typography>
        <Typography
          sx={{
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: '-0.02em',
            color: ORBIT_TOKENS.ink[900],
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.1,
            mt: 0.5,
          }}
        >
          {value}
        </Typography>
        {hint && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: 12,
              fontWeight: 500,
              mt: 0.5,
              color: hintColor === 'success' ? '#10A56F' : ORBIT_TOKENS.ink[500],
            }}
          >
            {hintColor === 'success' && <TrendingUpOutlined sx={{ fontSize: 14 }} />}
            {hint}
          </Box>
        )}
        {progress != null && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, progress))}
              sx={{ height: 4 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export function HomePage() {
  const tasks = trpc.task.list.useQuery();
  const projects = trpc.project.list.useQuery();

  const taskList = tasks.data ?? [];
  const projectList = projects.data ?? [];

  const open = taskList.filter((t) => t.status !== 'DONE').length;
  const inProgress = taskList.filter((t) => t.status === 'IN_PROGRESS').length;
  const review = taskList.filter((t) => t.status === 'REVIEW').length;
  const done = taskList.filter((t) => t.status === 'DONE').length;
  const completion = taskList.length === 0 ? 0 : Math.round((done / taskList.length) * 100);

  const upcoming = [...taskList]
    .filter((t) => t.status !== 'DONE')
    .sort((a, b) => {
      const ax = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bx = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return ax - bx;
    })
    .slice(0, 4);

  return (
    <Stack spacing={0}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 12, color: ORBIT_TOKENS.ink[500], mb: 0.75 }}>
            Workspace
          </Typography>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: ORBIT_TOKENS.ink[500], mt: 0.5 }}>
            What&apos;s moving across your contacts, tasks, and projects.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<CalendarTodayOutlined fontSize="small" />}>
            This week
          </Button>
          <Button variant="contained" startIcon={<AddOutlined fontSize="small" />}>
            New task
          </Button>
        </Stack>
      </Box>

      {/* Stats row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatCard label="Open tasks" value={open} hint={`${String(done)} done so far`} />
        <StatCard label="In progress" value={inProgress} hint={`${String(review)} in review`} />
        <StatCard label="Projects" value={projectList.length} hint="Across all teams" />
        <StatCard label="Completion" value={`${String(completion)}%`} progress={completion} />
      </Box>

      {/* Two-column */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 2 }}>
        {/* Upcoming work */}
        <Card>
          <Box
            sx={{
              p: '16px 20px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: ORBIT_TOKENS.ink[900] }}>
                Upcoming work
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: ORBIT_TOKENS.ink[500], mt: 0.25 }}>
                Tasks coming due soon
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: ORBIT_TOKENS.ink[100] }} />
          {upcoming.length === 0 && (
            <Box sx={{ p: 6, textAlign: 'center', color: ORBIT_TOKENS.ink[500] }}>
              Nothing due. Inbox zero vibes.
            </Box>
          )}
          {upcoming.map((t) => (
            <Box
              key={t.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1.5,
                borderBottom: `1px solid ${ORBIT_TOKENS.ink[100]}`,
                '&:last-of-type': { borderBottom: 'none' },
              }}
            >
              <StatusIcon status={t.status} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: ORBIT_TOKENS.ink[900] }}>
                  {t.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: ORBIT_TOKENS.ink[500], mt: 0.25 }}>
                  {t.project?.name ?? '—'}
                </Typography>
              </Box>
              <Chip
                size="small"
                color={PRIORITY_COLOR[t.priority]}
                label={t.priority.toLowerCase()}
                sx={{ textTransform: 'capitalize' }}
              />
              <Typography
                sx={{
                  fontSize: 12.5,
                  color: ORBIT_TOKENS.ink[500],
                  fontVariantNumeric: 'tabular-nums',
                  width: 78,
                  textAlign: 'right',
                }}
              >
                {fmtShort(t.dueDate)}
              </Typography>
              {t.assignee ? (
                <Avatar
                  sx={{
                    width: 22,
                    height: 22,
                    fontSize: 9.5,
                    bgcolor: avatarColor(`${t.assignee.firstName} ${t.assignee.lastName}`),
                  }}
                >
                  {avatarInitials(`${t.assignee.firstName} ${t.assignee.lastName}`)}
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
            </Box>
          ))}
        </Card>

        {/* Right column */}
        <Stack spacing={2}>
          <Card>
            <Box sx={{ p: '16px 20px 12px' }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: ORBIT_TOKENS.ink[900] }}>
                Active projects
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: ORBIT_TOKENS.ink[500], mt: 0.25 }}>
                {projectList.length} in flight
              </Typography>
            </Box>
            <Divider sx={{ borderColor: ORBIT_TOKENS.ink[100] }} />
            <Box sx={{ p: '4px 20px 16px' }}>
              {projectList.length === 0 && (
                <Box sx={{ py: 4, textAlign: 'center', color: ORBIT_TOKENS.ink[500] }}>
                  No projects yet.
                </Box>
              )}
              {projectList.map((p) => {
                const total = p._count.tasks;
                const doneInProject = taskList.filter(
                  (t) => t.project?.id === p.id && t.status === 'DONE',
                ).length;
                const pct = total === 0 ? 0 : Math.round((doneInProject / total) * 100);
                return (
                  <Box
                    key={p.id}
                    sx={{
                      py: 1.5,
                      borderBottom: `1px solid ${ORBIT_TOKENS.ink[100]}`,
                      '&:last-of-type': { borderBottom: 'none' },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.75,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 13.5, fontWeight: 500, color: ORBIT_TOKENS.ink[900] }}
                      >
                        {p.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: ORBIT_TOKENS.ink[600],
                          fontWeight: 500,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {pct}%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={pct} sx={{ height: 4 }} />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 11.5, color: ORBIT_TOKENS.ink[500] }}>
                        {p._count.members} members
                      </Typography>
                      <Chip
                        size="small"
                        color={p.status === 'active' ? 'success' : 'info'}
                        label={p.status}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    bgcolor: ORBIT_TOKENS.primarySoft,
                    color: ORBIT_TOKENS.primary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AutoAwesomeOutlined fontSize="small" />
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: ORBIT_TOKENS.ink[900] }}>
                  Tip
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 13, color: ORBIT_TOKENS.ink[600], lineHeight: 1.55 }}>
                This template ships with skill files at{' '}
                <Box
                  component="span"
                  sx={{
                    fontFamily: 'ui-monospace, monospace',
                    bgcolor: ORBIT_TOKENS.ink[100],
                    px: 0.625,
                    py: 0.125,
                    borderRadius: 0.5,
                    fontSize: 12.5,
                  }}
                >
                  skills/
                </Box>{' '}
                — point your AI agent at them.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
