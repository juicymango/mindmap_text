import React from 'react';
import styled from 'styled-components';

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

export const AIPromptDialog: React.FC<AIPromptDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
}) => {
  const [question, setQuestion] = React.useState('');

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
      </DialogContent>
    </DialogOverlay>
  );
};