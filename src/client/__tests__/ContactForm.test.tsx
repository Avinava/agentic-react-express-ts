import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContactForm } from '../components/ContactForm.js';

describe('ContactForm', () => {
  it('shows validation errors for missing required fields', async () => {
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ada@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
