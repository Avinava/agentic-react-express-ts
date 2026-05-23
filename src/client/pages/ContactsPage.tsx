import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
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

import { ContactForm } from '../components/ContactForm.js';
import { trpc } from '../trpc.js';

export function ContactsPage() {
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

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Contacts</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => setEditingId('new')}>
          New contact
        </Button>
      </Stack>

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.data?.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>
                  {c.firstName} {c.lastName}
                </TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.company ?? '—'}</TableCell>
                <TableCell>{c.phone ?? '—'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditingId(c.id)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (window.confirm(`Delete ${c.firstName}?`)) del.mutate({ id: c.id });
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {list.data && list.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                    No contacts yet — click <strong>New contact</strong> to add one.
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

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
