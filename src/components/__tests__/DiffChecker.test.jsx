import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DiffChecker from '../DiffChecker';

describe('DiffChecker Component', () => {
  it('highlights differences between original and modified text', () => {
    render(<DiffChecker />);
    const originalTextarea = screen.getByPlaceholderText(/Enter original text/i);
    const modifiedTextarea = screen.getByPlaceholderText(/Enter modified text/i);

    fireEvent.change(originalTextarea, { target: { value: 'Hello world' } });
    fireEvent.change(modifiedTextarea, { target: { value: 'Hello new world' } });

    const compareBtn = screen.getByRole('button', { name: /Compare Texts/i });
    fireEvent.click(compareBtn);

    const resultHeader = screen.getByText(/Comparison Result/i);
    expect(resultHeader).toBeInTheDocument();
  });
});
