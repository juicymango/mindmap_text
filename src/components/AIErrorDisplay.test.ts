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
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
  });

  it('should show error icon', () => {
    renderErrorDisplay('Network Error');
    
    expect(screen.getByText('🌐')).toBeInTheDocument();
  });

  it('should show severity badge', () => {
    renderErrorDisplay('401 Unauthorized');
    
    expect(screen.getByText('HIGH')).toBeInTheDocument();
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
    
    expect(screen.queryByText('Technical Details')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Technical Details'));
    expect(screen.getByText('401 Unauthorized')).toBeInTheDocument();
  });

  it('should start with technical details expanded when showDetails is true', () => {
    renderErrorDisplay('401 Unauthorized', true);
    
    expect(screen.getByText('401 Unauthorized')).toBeInTheDocument();
  });

  it('should handle different error types correctly', () => {
    const testCases = [
      { error: 'Network Error', expectedIcon: '🌐', expectedSeverity: 'MEDIUM' },
      { error: '401 Unauthorized', expectedIcon: '🔐', expectedSeverity: 'HIGH' },
      { error: '429 Too Many Requests', expectedIcon: '⚡', expectedSeverity: 'MEDIUM' },
      { error: 'Invalid configuration', expectedIcon: '⚙️', expectedSeverity: 'HIGH' },
      { error: 'Failed to parse', expectedIcon: '📝', expectedSeverity: 'MEDIUM' },
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
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    renderErrorDisplay('Test error');
    
    const dismissButton = screen.queryByText('×');
    if (dismissButton) {
      expect(dismissButton).toHaveAttribute('type', 'button');
    }
    
    const detailsSummary = screen.getByText('Technical Details');
    expect(detailsSummary).toHaveAttribute('role', 'button');
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
      
      expect(screen.getByText(error)).toBeInTheDocument();
      expect(screen.getByText('What you can do:')).toBeInTheDocument();
      
      // Clean up
      container.remove();
    });
  });

  it('should toggle technical details visibility', () => {
    renderErrorDisplay('Test error message');
    
    const detailsToggle = screen.getByText('Technical Details');
    
    // Initially hidden
    expect(screen.queryByText('Test error message', { selector: 'pre' })).not.toBeInTheDocument();
    
    // Click to show
    fireEvent.click(detailsToggle);
    expect(screen.getByText('Test error message', { selector: 'pre' })).toBeInTheDocument();
    
    // Click to hide
    fireEvent.click(detailsToggle);
    expect(screen.queryByText('Test error message', { selector: 'pre' })).not.toBeInTheDocument();
  });
});