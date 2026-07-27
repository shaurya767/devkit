import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CSVJSONConverter from '../CSVJSONConverter';

describe('CSVJSONConverter Component', () => {
  it('converts valid CSV to JSON format correctly', () => {
    render(<CSVJSONConverter />);
    const textareaInput = screen.getByPlaceholderText(/Paste your CSV rows/i);
    fireEvent.change(textareaInput, { target: { value: 'name,age\nAlice,30\nBob,25' } });

    const csvToJSONBtn = screen.getByRole('button', { name: /CSV to JSON/i });
    fireEvent.click(csvToJSONBtn);

    const textareaOutput = screen.getByPlaceholderText(/Converted table strings will/i);
    expect(textareaOutput.value).toContain('"name": "Alice"');
    expect(textareaOutput.value).toContain('"age": 30');
  });

  it('displays a validation error when converting a non-array JSON structure to CSV', () => {
    render(<CSVJSONConverter />);
    const textareaInput = screen.getByPlaceholderText(/Paste your CSV rows/i);
    // Paste non-array object
    fireEvent.change(textareaInput, { target: { value: '{"name": "Alice"}' } });

    const jsonToCSVBtn = screen.getByRole('button', { name: /JSON Array to CSV/i });
    fireEvent.click(jsonToCSVBtn);

    expect(screen.getByText(/Conversion Error: Input JSON must be a valid Array/i)).toBeInTheDocument();
  });
});
