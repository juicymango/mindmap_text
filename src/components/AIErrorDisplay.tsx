import React from 'react';
import styled from 'styled-components';
import { analyzeAIError, getAIErrorIcon, getAIErrorColor, AIErrorAnalysis } from '../utils/aiErrorHandling';

interface AIErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
  showDetails?: boolean;
}

const ErrorContainer = styled.div<{ severity: string }>`
  padding: 16px;
  border-radius: 8px;
  margin: 12px 0;
  border-left: 4px solid ${props => getAIErrorColor(props.severity as any)};
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ErrorTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
`;

const ErrorIcon = styled.span`
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
`;

const SuggestionsContainer = styled.div`
  margin-top: 12px;
`;

const SuggestionsTitle = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
  font-size: 13px;
`;

const SuggestionsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 4px;
    font-size: 13px;
    color: #666;
    line-height: 1.4;
  }
`;

const TechnicalDetails = styled.details`
  margin-top: 12px;
  
  summary {
    cursor: pointer;
    font-size: 12px;
    color: #007bff;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TechnicalContent = styled.pre`
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: pre-wrap;
  margin-top: 4px;
  border: 1px solid #e9ecef;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: #f8f9fa;
    color: #333;
  }
`;

const SeverityBadge = styled.span<{ severity: string }>`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  background: ${props => getAIErrorColor(props.severity as any)};
  color: white;
  text-transform: uppercase;
  font-weight: 500;
`;

export const AIErrorDisplay: React.FC<AIErrorDisplayProps> = ({
  error,
  onDismiss,
  showDetails = false,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(showDetails);
  
  if (!error) return null;
  
  const analysis: AIErrorAnalysis = analyzeAIError(error);
  
  return (
    <ErrorContainer severity={analysis.severity}>
      <ErrorHeader>
        <ErrorTitle>
          <ErrorIcon>{getAIErrorIcon(analysis.type)}</ErrorIcon>
          <span>{analysis.message}</span>
          <SeverityBadge severity={analysis.severity}>
            {analysis.severity}
          </SeverityBadge>
        </ErrorTitle>
        {onDismiss && (
          <DismissButton onClick={onDismiss}>×</DismissButton>
        )}
      </ErrorHeader>
      
      <ErrorMessage>{error}</ErrorMessage>
      
      <SuggestionsContainer>
        <SuggestionsTitle>What you can do:</SuggestionsTitle>
        <SuggestionsList>
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </SuggestionsList>
      </SuggestionsContainer>
      
      {analysis.technicalDetails && (
        <TechnicalDetails 
          open={showTechnicalDetails}
          onToggle={() => setShowTechnicalDetails(!showTechnicalDetails)}
        >
          <summary>Technical Details</summary>
          <TechnicalContent>{analysis.technicalDetails}</TechnicalContent>
        </TechnicalDetails>
      )}
    </ErrorContainer>
  );
};