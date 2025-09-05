import { render, fireEvent, screen, act } from '@testing-library/react';
import { AIConfigDialog } from './AIConfigDialog';
import { SelectedPathProvider } from '../contexts/SelectedPathContext';
import { AIConfig } from '../config/ai';

describe('AIConfigDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockConfig: AIConfig = {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    apiKey: 'test-api-key',
    maxTokens: 1000,
    temperature: 0.7,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderDialog = (isOpen = true, config = mockConfig) => {
    return render(
      <SelectedPathProvider>
        <AIConfigDialog
          isOpen={isOpen}
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentConfig={config}
        />
      </SelectedPathProvider>
    );
  };

  it('should not render when closed', () => {
    const { container } = renderDialog(false);
    expect(container.firstChild).toBeNull();
  });

  it('should render dialog when open', () => {
    renderDialog();
    expect(screen.getByText('AI Configuration')).toBeInTheDocument();
    expect(screen.getByLabelText('Provider')).toHaveValue('openai');
    expect(screen.getByLabelText('Model')).toHaveValue('gpt-3.5-turbo');
  });

  it('should handle provider change', () => {
    renderDialog();
    const providerSelect = screen.getByLabelText('Provider');
    
    fireEvent.change(providerSelect, { target: { value: 'anthropic' } });
    expect(providerSelect).toHaveValue('anthropic');
  });

  it('should show API key field for non-local providers', () => {
    renderDialog();
    expect(screen.getByLabelText('API Key')).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText('Provider'), { target: { value: 'local' } });
    expect(screen.queryByLabelText('API Key')).not.toBeInTheDocument();
  });

  it('should show base URL field for local provider', () => {
    renderDialog();
    expect(screen.queryByLabelText('Base URL')).not.toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText('Provider'), { target: { value: 'local' } });
    expect(screen.getByLabelText('Base URL')).toBeInTheDocument();
  });

  it('should handle model change', () => {
    renderDialog();
    const modelInput = screen.getByLabelText('Model');
    
    fireEvent.change(modelInput, { target: { value: 'gpt-4' } });
    expect(modelInput).toHaveValue('gpt-4');
  });

  it('should handle API key change', () => {
    renderDialog();
    const apiKeyInput = screen.getByLabelText('API Key');
    
    fireEvent.change(apiKeyInput, { target: { value: 'new-api-key' } });
    expect(apiKeyInput).toHaveValue('new-api-key');
  });

  it('should handle max tokens change', () => {
    renderDialog();
    const maxTokensInput = screen.getByDisplayValue('1000');
    
    fireEvent.change(maxTokensInput, { target: { value: '2000' } });
    expect(maxTokensInput).toHaveValue('2000');
  });

  it('should handle temperature change', () => {
    renderDialog();
    const temperatureInput = screen.getByDisplayValue('0.7');
    
    fireEvent.change(temperatureInput, { target: { value: '1.0' } });
    expect(temperatureInput).toHaveValue('1');
  });

  it('should call onSave with updated config when Save is clicked', () => {
    renderDialog();
    
    fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'gpt-4' } });
    fireEvent.change(screen.getByLabelText('API Key'), { target: { value: 'new-key' } });
    fireEvent.change(screen.getByDisplayValue('1000'), { target: { value: '1500' } });
    fireEvent.change(screen.getByDisplayValue('0.7'), { target: { value: '0.8' } });
    
    fireEvent.click(screen.getByText('Save Configuration'));
    
    expect(mockOnSave).toHaveBeenCalledWith({
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'new-key',
      maxTokens: 1500,
      temperature: 0.8,
    });
  });

  it('should call onClose when Cancel is clicked', () => {
    renderDialog();
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should validate configuration on test', () => {
    renderDialog();
    
    fireEvent.click(screen.getByText('Test Configuration'));
    
    expect(screen.getByText('Configuration is valid!')).toBeInTheDocument();
  });

  it('should show validation error for missing API key', () => {
    renderDialog(true, {
      ...mockConfig,
      apiKey: '',
    });
    
    fireEvent.click(screen.getByText('Test Configuration'));
    
    expect(screen.getByText('API key is required for this provider')).toBeInTheDocument();
  });

  it('should show validation error for missing base URL for local provider', () => {
    renderDialog(true, {
      ...mockConfig,
      provider: 'local',
      baseUrl: '',
    });
    
    fireEvent.click(screen.getByText('Test Configuration'));
    
    expect(screen.getByText('Base URL is required for local provider')).toBeInTheDocument();
  });

  it('should handle Escape key to close', () => {
    renderDialog();
    
    const overlay = screen.getByText('AI Configuration').closest('div');
    if (overlay) {
      fireEvent.keyDown(overlay, { key: 'Escape' });
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('should reset form when reopened', () => {
    const { rerender } = renderDialog();
    
    fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'gpt-4' } });
    
    rerender(
      <SelectedPathProvider>
        <AIConfigDialog
          isOpen={false}
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentConfig={mockConfig}
        />
      </SelectedPathProvider>
    );
    
    rerender(
      <SelectedPathProvider>
        <AIConfigDialog
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          currentConfig={mockConfig}
        />
      </SelectedPathProvider>
    );
    
    expect(screen.getByLabelText('Model')).toHaveValue('gpt-3.5-turbo');
  });

  it('should show correct helper text for different providers', () => {
    renderDialog();
    
    expect(screen.getByText('Examples: gpt-3.5-turbo, gpt-4')).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText('Provider'), { target: { value: 'anthropic' } });
    expect(screen.getByText('Examples: claude-3-sonnet-20240229, claude-3-opus-20240229')).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText('Provider'), { target: { value: 'local' } });
    expect(screen.getByText('Model name for your local AI service')).toBeInTheDocument();
  });
});