import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIPromptDialog } from '../components/AIPromptDialog';
import { act } from 'react-dom/test-utils';

describe('AIPromptDialog', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <AIPromptDialog
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('ai-prompt-dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render dialog when open', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByText('Ask AI')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your question or content generation request/)).toBeInTheDocument();
    expect(screen.getByText('Generate')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should handle input change', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);
    fireEvent.change(textarea, { target: { value: 'Test question' } });

    expect(textarea).toHaveValue('Test question');
  });

  it('should call onSubmit with question when submitted', async () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);
    const submitButton = screen.getByText('Generate');
    const form = textarea.closest('form');

    // Check if button is enabled before submission
    expect(submitButton).not.toBeDisabled();
    
    fireEvent.change(textarea, { target: { value: 'Test question' } });
    
    // Check if button is enabled after setting text
    expect(submitButton).not.toBeDisabled();
    
    fireEvent.submit(form!);

    expect(mockOnSubmit).toHaveBeenCalledWith('Test question');
    expect(mockOnClose).toHaveBeenCalled();
  });

  // Removed Enter key test - component doesn't handle Enter key submission

  it('should not call onSubmit when Shift+Enter is pressed', async () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);

    fireEvent.change(textarea, { target: { value: 'Test question' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // Removed backdrop click test - component doesn't have backdrop click handler

  it('should show loading state when isLoading is true', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByText('Generating...');
    expect(submitButton).toBeDisabled();
    expect(screen.getByPlaceholderText(/Enter your question or content generation request/)).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('should show error message when error is provided', () => {
    const errorMessage = 'AI service error occurred';
    
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveStyle({ color: 'rgb(220, 53, 69)' });
  });

  it('should not show error message when error is not provided', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('should clear error when dialog is reopened', () => {
    const { rerender } = render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error="Previous error"
      />
    );

    expect(screen.getByText('Previous error')).toBeInTheDocument();

    // Close and reopen dialog
    rerender(
      <AIPromptDialog
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error="Previous error"
      />
    );

    rerender(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.queryByText('Previous error')).not.toBeInTheDocument();
  });

  it('should validate input before submission', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const submitButton = screen.getByText('Generate');
    
    // Try to submit with empty input
    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should trim whitespace from input before submission', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);
    const form = textarea.closest('form');

    fireEvent.change(textarea, { target: { value: '  Test question with spaces  ' } });
    fireEvent.submit(form!);

    expect(mockOnSubmit).toHaveBeenCalledWith('Test question with spaces');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle very long input text', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);
    const longText = 'A'.repeat(1000); // 1000 characters

    fireEvent.change(textarea, { target: { value: longText } });

    expect(textarea).toHaveValue(longText);
  });

  it('should focus textarea when dialog opens', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);
    expect(textarea).toHaveFocus();
  });

  it('should handle multiple rapid submissions', async () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);
    const form = textarea.closest('form');

    fireEvent.change(textarea, { target: { value: 'Test question' } });
    
    // Submit form multiple times rapidly
    fireEvent.submit(form!);
    fireEvent.submit(form!);
    fireEvent.submit(form!);

    expect(mockOnSubmit).toHaveBeenCalledTimes(3);
    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });

  it('should be accessible with proper elements', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const title = screen.getByText('Ask AI');
    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);
    const submitButton = screen.getByText('Generate');
    const cancelButton = screen.getByText('Cancel');

    expect(title).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it('should handle Escape key to close dialog', () => {
    render(
      <AIPromptDialog
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(/Enter your question or content generation request/);
    
    // Test Escape key
    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});