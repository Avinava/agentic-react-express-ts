import { createTheme, alpha } from '@mui/material/styles';

const INK = {
  900: '#0B0F17',
  800: '#1A1F2C',
  700: '#2A3142',
  600: '#475066',
  500: '#6B7388',
  400: '#9099AE',
  300: '#C9CEDB',
  200: '#E4E7EF',
  100: '#EFF1F6',
  50: '#F7F8FB',
};

const PRIMARY = '#4F46E5';
const PRIMARY_HOVER = '#4338CA';
const PRIMARY_SOFT = '#EEF0FF';
const PRIMARY_INK = '#1E1B4B';

export const ORBIT_TOKENS = {
  primary: PRIMARY,
  primaryHover: PRIMARY_HOVER,
  primarySoft: PRIMARY_SOFT,
  primaryInk: PRIMARY_INK,
  ink: INK,
  sidebarWidth: 248,
  topbarHeight: 56,
  rowHeight: 52,
  shadow: {
    sm: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 1px rgba(15, 23, 42, 0.03)',
    md: '0 2px 6px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
    lg: '0 8px 24px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)',
  },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: PRIMARY, dark: PRIMARY_HOVER, light: PRIMARY_SOFT, contrastText: '#FFFFFF' },
    secondary: { main: '#0EA5E9' },
    success: { main: '#10A56F', light: '#E6F7EF', dark: '#064E32' },
    warning: { main: '#D97706', light: '#FEF3C7', dark: '#78350F' },
    error: { main: '#DC2626', light: '#FEE2E2', dark: '#7F1D1D' },
    info: { main: '#0EA5E9', light: '#E0F2FE', dark: '#075985' },
    background: { default: INK[50], paper: '#FFFFFF' },
    text: { primary: INK[800], secondary: INK[500], disabled: INK[400] },
    divider: INK[200],
    grey: {
      50: INK[50],
      100: INK[100],
      200: INK[200],
      300: INK[300],
      400: INK[400],
      500: INK[500],
      600: INK[600],
      700: INK[700],
      800: INK[800],
      900: INK[900],
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontWeight: 600, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em' },
    h4: { fontWeight: 600, letterSpacing: '-0.02em', fontSize: '1.625rem' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '0.9375rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem', color: INK[500] },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      color: INK[500],
    },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '-0.005em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: INK[50],
          color: INK[800],
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: false },
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500, fontSize: '0.8125rem', padding: '7px 14px' },
        sizeSmall: { padding: '4px 10px', fontSize: '0.78rem' },
        sizeLarge: { padding: '9px 18px', fontSize: '0.875rem' },
        containedPrimary: {
          '&:hover': { backgroundColor: PRIMARY_HOVER },
        },
        outlined: {
          borderColor: INK[200],
          color: INK[800],
          backgroundColor: '#FFFFFF',
          '&:hover': { backgroundColor: INK[50], borderColor: INK[300] },
        },
        text: { color: INK[700], '&:hover': { backgroundColor: INK[50] } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: INK[500],
          borderRadius: 8,
          '&:hover': { backgroundColor: INK[100], color: INK[800] },
        },
        sizeSmall: { width: 26, height: 26 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0, variant: 'outlined' },
      styleOverrides: {
        root: { borderColor: INK[200], borderRadius: 10, backgroundColor: '#FFFFFF' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { outlined: { borderColor: INK[200] } },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 22,
          fontSize: '0.71875rem',
          fontWeight: 500,
          letterSpacing: '0.01em',
          borderRadius: 999,
        },
        sizeSmall: { height: 22, fontSize: '0.71875rem' },
        outlined: { borderColor: INK[200], backgroundColor: 'transparent' },
        colorDefault: { backgroundColor: INK[100], color: INK[700] },
        colorPrimary: { backgroundColor: PRIMARY_SOFT, color: PRIMARY_INK },
        colorSuccess: { backgroundColor: '#E6F7EF', color: '#064E32' },
        colorWarning: { backgroundColor: '#FEF3C7', color: '#78350F' },
        colorError: { backgroundColor: '#FEE2E2', color: '#7F1D1D' },
        colorInfo: { backgroundColor: '#E0F2FE', color: '#075985' },
      },
    },
    MuiTable: { styleOverrides: { root: { backgroundColor: '#FFFFFF' } } },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& th': {
            backgroundColor: INK[50],
            color: INK[500],
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: `1px solid ${INK[200]}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${INK[100]}`, color: INK[800], fontSize: '0.84375rem' },
        head: { padding: '12px 16px' },
        body: { padding: '0 16px', height: 52 },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background 60ms',
          '&:last-of-type td': { borderBottom: 'none' },
          '&:hover': {
            backgroundColor: INK[50],
            '& .row-actions': { opacity: 1 },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 6, borderRadius: 999, backgroundColor: INK[100] },
        bar: { backgroundColor: PRIMARY, borderRadius: 999 },
      },
    },
    MuiAvatar: {
      styleOverrides: { root: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: 0 } },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: INK[500],
          minHeight: 40,
          '&.Mui-selected': { color: PRIMARY },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40, borderBottom: `1px solid ${INK[200]}` },
        indicator: { backgroundColor: PRIMARY, height: 2 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          '& fieldset': { borderColor: INK[200] },
          '&:hover fieldset': { borderColor: INK[300] },
          '&.Mui-focused fieldset': {
            borderColor: PRIMARY,
            boxShadow: `0 0 0 4px ${alpha(PRIMARY, 0.2)}`,
          },
        },
        input: { fontSize: '0.84375rem' },
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 14 } } },
    MuiAppBar: {
      defaultProps: { color: 'inherit', elevation: 0 },
      styleOverrides: {
        root: { backgroundColor: '#FFFFFF', borderBottom: `1px solid ${INK[200]}` },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#FFFFFF', borderRight: `1px solid ${INK[200]}` },
      },
    },
  },
});
