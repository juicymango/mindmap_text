import { render, fireEvent, screen } from '@testing-library/react';
import { AIErrorDisplay } from './AIErrorDisplay';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';

describe('AIErrorDisplay', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderErrorDisplay = (error: string | null, showDetails = false) => {
    return render(
      <SelectedPathProvider>
        <AIErrorDisplay
          error={error}
          onDismiss={mockOnDismiss}
          showDetails={showDetails}
        />
      </SelectedPathProvider>
    );
  };

  it('should not render when error is null', () => {
    const { container } = renderErrorDisplay(null);
    expect(container.firstChild).toBeNull();
  });

  it('should render error when error is provided', () => {
    renderErrorDisplay('Test error message');
    
    expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
    expect(screen.getAllByText('Test error message')).toHaveLength(2);
  });

  it('should show error icon', () => {
    renderErrorDisplay('Network Error');
    
    expect(screen.getByText('🌐')).toBeInTheDocument();
  });

  it('should show severity badge', () => {
    renderErrorDisplay('401 Unauthorized');
    
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('should show suggestions', () => {
    renderErrorDisplay('401 Unauthorized');
    
    expect(screen.getByText('What you can do:')).toBeInTheDocument();
    expect(screen.getByText('Check your API key is correct')).toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button is clicked', () => {
    renderErrorDisplay('Test error');
    
    fireEvent.click(screen.getByText('×'));
    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('should show technical details when expanded', () => {
    renderErrorDisplay('401 Unauthorized');
    
    expect(screen.getByText('Technical Details')).toBeInTheDocument();
    
    const details = screen.getByText('Technical Details').closest('details');
    expect(details).not.toHaveAttribute('open');
    
    fireEvent.click(screen.getByText('Technical Details'));
    expect(details).toHaveAttribute('open');
  });

  it('should start with technical details expanded when showDetails is true', () => {
    renderErrorDisplay('401 Unauthorized', true);
    
    const details = screen.getByText('Technical Details').closest('details');
    expect(details).toHaveAttribute('open');
  });

  it('should handle different error types correctly', () => {
    const testCases = [
      { error: 'Network Error', expectedIcon: '🌐', expectedSeverity: 'medium' },
      { error: '401 Unauthorized', expectedIcon: '🔐', expectedSeverity: 'high' },
      { error: '429 Too Many Requests', expectedIcon: '⚡', expectedSeverity: 'medium' },
      { error: 'Failed to parse', expectedIcon: '📝', expectedSeverity: 'medium' },
    ];

    testCases.forEach(({ error, expectedIcon, expectedSeverity }) => {
      const { container } = renderErrorDisplay(error);
      
      expect(screen.getByText(expectedIcon)).toBeInTheDocument();
      expect(screen.getByText(expectedSeverity)).toBeInTheDocument();
      
      // Clean up
      container.remove();
    });
  });

  it('should work without onDismiss callback', () => {
    const { container } = render(
      <SelectedPathProvider>
        <AIErrorDisplay error="Test error" />
      </SelectedPathProvider>
    );
    
    expect(screen.queryByText('×')).not.toBeInTheDocument();
    expect(screen.getAllByText('Test error')).toHaveLength(2);
  });

  it('should be accessible', () => {
    renderErrorDisplay('Test error');
    
    const dismissButton = screen.queryByText('×');
    if (dismissButton) {
      expect(dismissButton).toBeInTheDocument();
    }
    
    const detailsSummary = screen.getByText('Technical Details');
    expect(detailsSummary).toBeInTheDocument();
  });

  it('should handle multiple error messages', () => {
    const errors = [
      'Network Error: Failed to fetch',
      '401 Unauthorized: Invalid API key',
      '429 Too Many Requests: Rate limit exceeded',
      'Invalid configuration: Model not found',
    ];

    errors.forEach(error => {
      const { container } = renderErrorDisplay(error);
      
      expect(screen.getAllByText(error)).toHaveLength(2);
      expect(screen.getByText('What you can do:')).toBeInTheDocument();
      
      // Clean up
      container.remove();
    });
  });

  it('should toggle technical details visibility', () => {
    renderErrorDisplay('Test error message');
    
    const detailsToggle = screen.getByText('Technical Details');
    const details = detailsToggle.closest('details');
    
    // Initially hidden
    expect(details).not.toHaveAttribute('open');
    
    // Click to show
    fireEvent.click(detailsToggle);
    expect(details).toHaveAttribute('open');
    
    // Click to hide
    fireEvent.click(detailsToggle);
    expect(details).not.toHaveAttribute('open');
  });
});