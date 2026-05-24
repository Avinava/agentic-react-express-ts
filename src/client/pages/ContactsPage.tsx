import {
  AddOutlined,
  ApartmentOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  TuneOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { PageHeader } from '../components/AppShell.js';
import { ContactForm } from '../components/ContactForm.js';
import { avatarColor, avatarInitials } from '../lib/avatar.js';
import { ORBIT_TOKENS } from '../theme/theme.js';
import { trpc } from '../trpc.js';

export function ContactsPage() {
  const [query, setQuery] = useState('');
  const utils = trpc.useUtils();
  const list = trpc.contact.list.useQuery();
  const create = trpc.contact.create.useMutation({
    onSuccess: () => {
      toast.success('Contact created');
      void utils.contact.list.invalidate();
    },
  });
  const update = trpc.contact.update.useMutation({
    onSuccess: () => {
      toast.success('Contact updated');
      void utils.contact.list.invalidate();
    },
  });
  const del = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast.success('Contact deleted');
      void utils.contact.list.invalidate();
    },
  });

  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const editing = list.data?.find((c) => c.id === editingId) ?? null;

  const contacts = list.data ?? [];
  const filtered = contacts.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company ?? ''}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <Stack spacing={0}>
      <PageHeader
        crumb="Workspace"
        title="Contacts"
        subtitle="People you work with — collaborators, clients, vendors."
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
              New contact
            </Button>
          </>
        }
      />

      <Tabs value={0} sx={{ mb: 2.5 }}>
        <Tab label={`All  ${String(contacts.length)}`} />
      </Tabs>

      <Card>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: '12px 16px',
            borderBottom: `1px solid ${ORBIT_TOKENS.ink[100]}`,
          }}
        >
          <Box
            sx={{
              flex: 1,
              maxWidth: 320,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: ORBIT_TOKENS.ink[50],
              borderRadius: 1.5,
              px: 1.5,
              py: 0.75,
              '&:focus-within': {
                bgcolor: '#fff',
                boxShadow: `0 0 0 4px ${ORBIT_TOKENS.primarySoft}`,
              },
            }}
          >
            <SearchOutlined sx={{ fontSize: 16, color: ORBIT_TOKENS.ink[500] }} />
            <InputBase
              placeholder="Search by name, email, company…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1, fontSize: 13, color: ORBIT_TOKENS.ink[800] }}
            />
          </Box>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 12.5, color: ORBIT_TOKENS.ink[500] }}>
            {filtered.length} of {contacts.length}
          </Typography>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '28%' }}>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell sx={{ width: 100, textAlign: 'right' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((c) => {
              const full = `${c.firstName} ${c.lastName}`;
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: 11,
                          bgcolor: avatarColor(full),
                        }}
                      >
                        {avatarInitials(full)}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{ fontWeight: 500, color: ORBIT_TOKENS.ink[900], fontSize: 13.5 }}
                        >
                          {full}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: ORBIT_TOKENS.ink[500] }}>
                          {c._count.tasks} task{c._count.tasks === 1 ? '' : 's'} ·{' '}
                          {c._count.projects} project{c._count.projects === 1 ? '' : 's'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: ORBIT_TOKENS.ink[700],
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: 12.5,
                    }}
                  >
                    {c.email}
                  </TableCell>
                  <TableCell
                    sx={{ color: ORBIT_TOKENS.ink[500], fontVariantNumeric: 'tabular-nums' }}
                  >
                    {c.phone ?? '—'}
                  </TableCell>
                  <TableCell>
                    {c.company ? (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.75,
                          color: ORBIT_TOKENS.ink[700],
                        }}
                      >
                        <ApartmentOutlined sx={{ fontSize: 16, color: ORBIT_TOKENS.ink[400] }} />
                        {c.company}
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
                      <IconButton size="small" onClick={() => setEditingId(c.id)} aria-label="Edit">
                        <EditOutlined fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="Delete"
                        sx={{ '&:hover': { color: '#DC2626', bgcolor: '#FEE2E2' } }}
                        onClick={() => {
                          if (window.confirm(`Delete ${c.firstName}?`)) {
                            del.mutate({ id: c.id });
                          }
                        }}
                      >
                        <DeleteOutlined fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ p: 6, textAlign: 'center', color: ORBIT_TOKENS.ink[500] }}>
                    {contacts.length === 0
                      ? 'No contacts yet — click New contact to add one.'
                      : 'Nothing matches your search.'}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={editingId !== null} onClose={() => setEditingId(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId === 'new' ? 'New contact' : 'Edit contact'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ContactForm
              defaultValues={editing ?? undefined}
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
