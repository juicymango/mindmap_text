import React from 'react';
import styled from 'styled-components';
import { useMindMapStore } from '../store/mindmapStore';

interface AIPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string) => void;
  isLoading: boolean;
  error?: string;
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
  min-width: 500px;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DialogTitle = styled.h2`
  margin: 0 0 16px 0;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin: 12px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
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

const HelperText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 16px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? '#007bff' : '#666'};
  font-size: 14px;
  
  &:hover {
    color: #007bff;
  }
`;

const TabContent = styled.div<{ active: boolean }>`
  display: ${props => props.active ? 'block' : 'none'};
`;

const ProcessHistory = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  background: #f8f9fa;
`;

const HistoryItem = styled.div<{ success: boolean }>`
  margin-bottom: 12px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid ${props => props.success ? '#28a745' : '#dc3545'};
`;

const HistoryTimestamp = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
`;

const HistoryQuestion = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const HistoryDetails = styled.details`
  margin-top: 8px;
  
  summary {
    cursor: pointer;
    font-size: 12px;
    color: #007bff;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const HistoryPrompt = styled.pre`
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: pre-wrap;
  margin-top: 4px;
`;

const HistoryResponse = styled.pre`
  background: #e9ecef;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: pre-wrap;
  margin-top: 4px;
`;

const TransparencySection = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
`;

const TransparencyTitle = styled.h4`
  margin: 0 0 8px 0;
  color: #007bff;
  font-size: 14px;
`;

const TransparencyContent = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

export const AIPromptDialog: React.FC<AIPromptDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
}) => {
  const [question, setQuestion] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'prompt' | 'history'>('prompt');
  const { aiProcessHistory, aiConfig } = useMindMapStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setQuestion('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <DialogOverlay onKeyDown={handleKeyDown}>
      <DialogContent>
        <DialogTitle>Ask AI</DialogTitle>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'prompt'} 
            onClick={() => setActiveTab('prompt')}
          >
            New Request
          </Tab>
          <Tab 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          >
            Process History ({aiProcessHistory.length})
          </Tab>
        </TabContainer>

        <TabContent active={activeTab === 'prompt'}>
          <form onSubmit={handleSubmit}>
            <TextArea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question or content generation request...
              
Examples:
- What are the key components of a business plan?
- Generate pros and cons for remote work
- What are the main challenges in software development?
- Create a breakdown of marketing strategies"
              rows={6}
              disabled={isLoading}
              autoFocus
            />
            <HelperText>
              The AI will generate structured content based on your question and add it as child nodes to the selected node.
            </HelperText>
            
            <TransparencySection>
              <TransparencyTitle>AI Configuration</TransparencyTitle>
              <TransparencyContent>
                <strong>Provider:</strong> {aiConfig.provider}<br />
                <strong>Model:</strong> {aiConfig.model}<br />
                <strong>Max Tokens:</strong> {aiConfig.maxTokens}<br />
                <strong>Temperature:</strong> {aiConfig.temperature}
              </TransparencyContent>
            </TransparencySection>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonGroup>
              <Button 
                type="button" 
                onClick={onClose} 
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
            </ButtonGroup>
          </form>
        </TabContent>

        <TabContent active={activeTab === 'history'}>
          <ProcessHistory>
            {aiProcessHistory.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No AI requests yet. Make your first request to see the process history.
              </div>
            ) : (
              [...aiProcessHistory].reverse().map((item) => (
                <HistoryItem key={item.id} success={item.success}>
                  <HistoryTimestamp>
                    {item.timestamp.toLocaleString()}
                  </HistoryTimestamp>
                  <HistoryQuestion>Q: {item.question}</HistoryQuestion>
                  {item.error && (
                    <ErrorMessage style={{ marginTop: '4px', fontSize: '12px' }}>
                      Error: {item.error}
                    </ErrorMessage>
                  )}
                  <HistoryDetails>
                    <summary>View AI Process Details</summary>
                    <div>
                      <strong>Prompt sent to AI:</strong>
                      <HistoryPrompt>{item.prompt}</HistoryPrompt>
                      <strong>AI Response:</strong>
                      <HistoryResponse>{item.response || 'No response'}</HistoryResponse>
                    </div>
                  </HistoryDetails>
                </HistoryItem>
              ))
            )}
          </ProcessHistory>
          
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
          </ButtonGroup>
        </TabContent>
      </DialogContent>
    </DialogOverlay>
  );
};