import React from 'react';
import styled from 'styled-components';
import { AIConfig } from '../config/ai';

interface AIConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AIConfig) => void;
  currentConfig: AIConfig;
}

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 600px;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DialogTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const RangeInput = styled.input`
  width: 100%;
  margin-top: 4px;
`;

const RangeValue = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
`;

const HelperText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  
  ${({ variant = 'secondary' }) => 
    variant === 'primary' 
      ? `
          background-color: #007bff;
          color: white;
          &:hover:not(:disabled) {
            background-color: #0056b3;
          }
        `
      : `
          background-color: #6c757d;
          color: white;
          &:hover:not(:disabled) {
            background-color: #545b62;
          }
        `
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TestConnectionButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
  
  &:hover:not(:disabled) {
    background-color: #218838;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TestResult = styled.div<{ success?: boolean }>`
  font-size: 12px;
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
`;

export const AIConfigDialog: React.FC<AIConfigDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentConfig,
}) => {
  const [config, setConfig] = React.useState<AIConfig>(currentConfig);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setConfig(currentConfig);
      setTestResult(null);
    }
  }, [isOpen, currentConfig]);

  const handleInputChange = (field: keyof AIConfig, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Simple validation test
      if (!config.provider) {
        throw new Error('Provider is required');
      }
      if (!config.model) {
        throw new Error('Model is required');
      }
      if (config.provider !== 'local' && !config.apiKey) {
        throw new Error('API key is required for this provider');
      }
      if (config.provider === 'local' && !config.baseUrl) {
        throw new Error('Base URL is required for local provider');
      }
      
      setTestResult('Configuration is valid!');
    } catch (error) {
      setTestResult(error instanceof Error ? error.message : 'Test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <DialogOverlay onKeyDown={handleKeyDown}>
      <DialogContent>
        <DialogTitle>AI Configuration</DialogTitle>
        
        <FormGroup>
          <Label htmlFor="provider">Provider</Label>
          <Select
            id="provider"
            value={config.provider}
            onChange={(e) => handleInputChange('provider', e.target.value as 'openai' | 'anthropic' | 'local')}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="local">Local AI</option>
          </Select>
          <HelperText>Select your AI service provider</HelperText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            type="text"
            value={config.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            placeholder="e.g., gpt-3.5-turbo, claude-3-sonnet-20240229"
          />
          <HelperText>
            {config.provider === 'openai' && 'Examples: gpt-3.5-turbo, gpt-4'}
            {config.provider === 'anthropic' && 'Examples: claude-3-sonnet-20240229, claude-3-opus-20240229'}
            {config.provider === 'local' && 'Model name for your local AI service'}
          </HelperText>
        </FormGroup>

        {config.provider !== 'local' && (
          <FormGroup>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="Enter your API key"
            />
            <HelperText>Your API key will be stored locally and encrypted</HelperText>
          </FormGroup>
        )}

        {config.provider === 'local' && (
          <FormGroup>
            <Label htmlFor="baseUrl">Base URL</Label>
            <Input
              id="baseUrl"
              type="text"
              value={config.baseUrl || ''}
              onChange={(e) => handleInputChange('baseUrl', e.target.value)}
              placeholder="http://localhost:8000"
            />
            <HelperText>URL for your local AI service</HelperText>
          </FormGroup>
        )}

        <FormGroup>
          <Label htmlFor="maxTokens">
            Max Tokens
            <RangeValue>{config.maxTokens}</RangeValue>
          </Label>
          <RangeInput
            id="maxTokens"
            type="range"
            min="100"
            max="4000"
            value={config.maxTokens}
            onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
          />
          <HelperText>Maximum number of tokens in the response</HelperText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="temperature">
            Temperature
            <RangeValue>{config.temperature}</RangeValue>
          </Label>
          <RangeInput
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
          />
          <HelperText>
            0 = deterministic, 1 = creative, 2 = very creative
          </HelperText>
        </FormGroup>

        <TestConnectionButton 
          onClick={handleTestConnection}
          disabled={isTesting}
        >
          {isTesting ? 'Testing...' : 'Test Configuration'}
        </TestConnectionButton>

        {testResult && (
          <TestResult success={!testResult.includes('Error') && !testResult.includes('failed')}>
            {testResult}
          </TestResult>
        )}

        <ButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            Save Configuration
          </Button>
        </ButtonGroup>
      </DialogContent>
    </DialogOverlay>
  );
};