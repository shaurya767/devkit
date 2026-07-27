import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JSONFormatter from '../JSONFormatter';

describe('JSONFormatter Component', () => {
  it('formats raw valid JSON correctly when Prettify is clicked', () => {
    render(<JSONFormatter />);
    const textareaInput = screen.getByPlaceholderText(/Paste your raw JSON here/i);
    fireEvent.change(textareaInput, { target: { value: '{"a":1,"b":"hello"}' } });

    const prettifyBtn = screen.getByRole('button', { name: /Prettify/i });
    fireEvent.click(prettifyBtn);

    const textareaOutput = screen.getByPlaceholderText(/Formatted output will appear here/i);
    expect(textareaOutput.value).toContain('"a": 1');
    expect(textareaOutput.value).toContain('"b": "hello"');
  });

  it('displays a red error banner when input contains invalid JSON syntax', () => {
    render(<JSONFormatter />);
    const textareaInput = screen.getByPlaceholderText(/Paste your raw JSON here/i);
    fireEvent.change(textareaInput, { target: { value: '{"a": 1, invalid}' } });

    const prettifyBtn = screen.getByRole('button', { name: /Prettify/i });
    fireEvent.click(prettifyBtn);

    expect(screen.getByText(/Invalid JSON:/i)).toBeInTheDocument();
  });
});
