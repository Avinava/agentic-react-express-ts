import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import { taskInput } from '../../shared/schemas/index.js';
import { trpc } from '../trpc.js';

import type { TaskInput } from '../../shared/schemas/index.js';

type Props = {
  defaultValues?: Partial<TaskInput>;
  onSubmit: (data: TaskInput) => void;
  submitting?: boolean;
  submitLabel?: string;
};

const STATUSES: TaskInput['status'][] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
const PRIORITIES: TaskInput['priority'][] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function TaskForm({ defaultValues, onSubmit, submitting, submitLabel = 'Save' }: Props) {
  const contacts = trpc.contact.list.useQuery();
  const projects = trpc.project.list.useQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskInput),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: null,
      assigneeId: null,
      projectId: null,
      ...defaultValues,
    },
  });

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Title"
        {...register('title')}
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
      />
      <TextField label="Description" multiline minRows={3} {...register('description')} />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <TextField select label="Status" {...field} value={field.value ?? 'TODO'}>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s.replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <TextField select label="Priority" {...field} value={field.value ?? 'MEDIUM'}>
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        name="assigneeId"
        control={control}
        render={({ field }) => (
          <TextField
            select
            label="Assignee"
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
          >
            <MenuItem value="">— None —</MenuItem>
            {contacts.data?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        name="projectId"
        control={control}
        render={({ field }) => (
          <TextField
            select
            label="Project"
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
          >
            <MenuItem value="">— None —</MenuItem>
            {projects.data?.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Button type="submit" variant="contained" disabled={submitting}>
        {submitLabel}
      </Button>
    </Stack>
  );
}
