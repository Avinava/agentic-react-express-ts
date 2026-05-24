import {
  AutoAwesomeOutlined,
  CheckCircleOutlined,
  FolderOutlined,
  HomeOutlined,
  NotificationsNoneOutlined,
  PeopleAltOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import { ORBIT_TOKENS } from '../theme/theme.js';
import { trpc } from '../trpc.js';

import type { ReactNode } from 'react';

const SIDEBAR_W = ORBIT_TOKENS.sidebarWidth;
const TOPBAR_H = ORBIT_TOKENS.topbarHeight;

function Logo({ size = 28 }: { size?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      sx={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden
    >
      <defs>
        <linearGradient id="orbit-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#orbit-logo-g)" />
      <circle cx="16" cy="16" r="2.6" fill="#fff" />
      <path
        d="M16 6.6 A 9.4 9.4 0 0 1 25.4 16"
        stroke="#fff"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M16 25.4 A 9.4 9.4 0 0 1 6.6 16"
        stroke="#fff"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />
    </Box>
  );
}

function NavItem({
  to,
  icon,
  label,
  count,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  count?: number;
}) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <ListItemButton
      component={Link}
      to={to}
      selected={active}
      sx={{
        borderRadius: 1.5,
        py: 0.75,
        px: 1.25,
        mb: 0.25,
        '&.Mui-selected': {
          bgcolor: ORBIT_TOKENS.primarySoft,
          color: ORBIT_TOKENS.primaryInk,
          '&:hover': { bgcolor: ORBIT_TOKENS.primarySoft },
          '& .MuiListItemIcon-root': { color: ORBIT_TOKENS.primary },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 28, color: ORBIT_TOKENS.ink[500] }}>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
      {count != null && (
        <Box
          sx={{
            fontSize: 11,
            fontVariantNumeric: 'tabular-nums',
            color: active ? ORBIT_TOKENS.primaryInk : ORBIT_TOKENS.ink[500],
            bgcolor: active ? '#DDE0FF' : ORBIT_TOKENS.ink[100],
            px: 0.875,
            py: '1px',
            borderRadius: 999,
            fontWeight: 500,
          }}
        >
          {count}
        </Box>
      )}
    </ListItemButton>
  );
}

function Sidebar() {
  const contacts = trpc.contact.list.useQuery();
  const tasks = trpc.task.list.useQuery();
  const projects = trpc.project.list.useQuery();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_W,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_W,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          p: '16px 12px',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.25, pb: 2.25 }}>
        <Logo size={28} />
        <Box>
          <Typography
            sx={{
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '-0.01em',
              color: ORBIT_TOKENS.ink[900],
              lineHeight: 1.1,
            }}
          >
            agentic
          </Typography>
          <Typography
            sx={{
              fontSize: 10.5,
              color: ORBIT_TOKENS.ink[500],
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500,
              mt: '1px',
            }}
          >
            react · express · ts
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 1.25, borderColor: ORBIT_TOKENS.ink[100] }} />

      <List dense disablePadding>
        <NavItem to="/" icon={<HomeOutlined fontSize="small" />} label="Dashboard" />
      </List>

      <Typography
        sx={{
          fontSize: 10.5,
          color: ORBIT_TOKENS.ink[500],
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          px: 1.5,
          pt: 1.75,
          pb: 0.75,
        }}
      >
        Work
      </Typography>
      <List dense disablePadding>
        <NavItem
          to="/projects"
          icon={<FolderOutlined fontSize="small" />}
          label="Projects"
          count={projects.data?.length}
        />
        <NavItem
          to="/tasks"
          icon={<CheckCircleOutlined fontSize="small" />}
          label="Tasks"
          count={tasks.data?.length}
        />
        <NavItem
          to="/contacts"
          icon={<PeopleAltOutlined fontSize="small" />}
          label="Contacts"
          count={contacts.data?.length}
        />
      </List>

      <Box sx={{ flex: 1 }} />

      <List dense disablePadding>
        <ListItemButton disabled sx={{ borderRadius: 1.5, py: 0.75, px: 1.25, opacity: 0.6 }}>
          <ListItemIcon sx={{ minWidth: 28, color: ORBIT_TOKENS.ink[500] }}>
            <SettingsOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
          />
        </ListItemButton>
      </List>

      <Divider sx={{ mt: 1.5, borderColor: ORBIT_TOKENS.ink[100] }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: '12px 10px' }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: ORBIT_TOKENS.primary, fontSize: 13 }}>
          A
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: ORBIT_TOKENS.ink[900],
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Agent
          </Typography>
          <Typography
            sx={{
              fontSize: 11.5,
              color: ORBIT_TOKENS.ink[500],
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            local-dev
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

function Topbar() {
  return (
    <AppBar
      position="sticky"
      sx={{ width: `calc(100% - ${String(SIDEBAR_W)}px)`, ml: `${String(SIDEBAR_W)}px`, top: 0 }}
    >
      <Toolbar
        variant="dense"
        sx={{
          height: TOPBAR_H,
          minHeight: TOPBAR_H,
          gap: 1.5,
          px: 3,
        }}
      >
        <Box
          sx={{
            flex: 1,
            maxWidth: 480,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: ORBIT_TOKENS.ink[50],
            border: '1px solid transparent',
            borderRadius: 1.5,
            px: 1.5,
            py: 0.75,
            transition: 'background 100ms, border-color 100ms',
            '&:hover': { bgcolor: ORBIT_TOKENS.ink[100] },
            '&:focus-within': { bgcolor: '#fff', borderColor: ORBIT_TOKENS.primary },
          }}
        >
          <Box component="span" sx={{ color: ORBIT_TOKENS.ink[500], display: 'inline-flex' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Box>
          <InputBase
            placeholder="Search projects, tasks, contacts…"
            sx={{ flex: 1, fontSize: 13, color: ORBIT_TOKENS.ink[800] }}
          />
          <Box
            sx={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 10.5,
              color: ORBIT_TOKENS.ink[500],
              bgcolor: '#fff',
              border: `1px solid ${ORBIT_TOKENS.ink[200]}`,
              borderRadius: 0.5,
              px: 0.75,
              py: '1px',
            }}
          >
            ⌘K
          </Box>
        </Box>
        <Box sx={{ flex: 1 }} />
        <IconButton size="small" aria-label="Notifications">
          <NotificationsNoneOutlined fontSize="small" />
        </IconButton>
        <IconButton size="small" aria-label="Help">
          <AutoAwesomeOutlined fontSize="small" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <Box sx={{ flex: 1, maxWidth: 1320, width: '100%', mx: 'auto', px: 3, py: 2.5, pb: 6 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export function PageHeader({
  crumb,
  title,
  subtitle,
  actions,
}: {
  crumb?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
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
        {crumb && (
          <Typography sx={{ fontSize: 12, color: ORBIT_TOKENS.ink[500], mb: 0.75 }}>
            {crumb}
          </Typography>
        )}
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: 13.5, color: ORBIT_TOKENS.ink[500], mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
    </Box>
  );
}
