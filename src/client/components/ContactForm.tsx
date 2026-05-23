import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

import { contactInput } from '../../shared/schemas/index.js';

import type { ContactInput } from '../../shared/schemas/index.js';

type Props = {
  defaultValues?: Partial<ContactInput>;
  onSubmit: (data: ContactInput) => void;
  submitting?: boolean;
  submitLabel?: string;
};

export function ContactForm({ defaultValues, onSubmit, submitting, submitLabel = 'Save' }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactInput),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      notes: '',
      ...defaultValues,
    },
  });

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="First name"
        {...register('firstName')}
        error={Boolean(errors.firstName)}
        helperText={errors.firstName?.message}
      />
      <TextField
        label="Last name"
        {...register('lastName')}
        error={Boolean(errors.lastName)}
        helperText={errors.lastName?.message}
      />
      <TextField
        label="Email"
        {...register('email')}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />
      <TextField label="Phone" {...register('phone')} />
      <TextField label="Company" {...register('company')} />
      <TextField label="Notes" multiline minRows={3} {...register('notes')} />
      <Button type="submit" variant="contained" disabled={submitting}>
        {submitLabel}
      </Button>
    </Stack>
  );
}
