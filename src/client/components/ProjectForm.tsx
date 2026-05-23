import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

import { projectInput } from '../../shared/schemas/index.js';

import type { ProjectInput } from '../../shared/schemas/index.js';

type Props = {
  defaultValues?: Partial<ProjectInput>;
  onSubmit: (data: ProjectInput) => void;
  submitting?: boolean;
  submitLabel?: string;
};

export function ProjectForm({ defaultValues, onSubmit, submitting, submitLabel = 'Save' }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectInput),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      ...defaultValues,
    },
  });

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        {...register('name')}
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
      />
      <TextField label="Description" multiline minRows={3} {...register('description')} />
      <TextField label="Status" {...register('status')} />
      <Button type="submit" variant="contained" disabled={submitting}>
        {submitLabel}
      </Button>
    </Stack>
  );
}
