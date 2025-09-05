export interface AIErrorAnalysis {
  type: 'network' | 'authentication' | 'rate_limit' | 'invalid_config' | 'parsing' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestions: string[];
  technicalDetails?: string;
}

export const analyzeAIError = (error: Error | string): AIErrorAnalysis => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // Network errors
  if (errorMessage.includes('Network Error') || 
      errorMessage.includes('fetch') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('timeout')) {
    return {
      type: 'network',
      severity: 'medium',
      message: 'Network connection error',
      suggestions: [
        'Check your internet connection',
        'Verify the AI service URL is correct',
        'Try again in a few moments',
        'Check if the AI service is down'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Authentication errors
  if (errorMessage.includes('401') || 
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('invalid api key') ||
      errorMessage.includes('authentication')) {
    return {
      type: 'authentication',
      severity: 'high',
      message: 'Authentication failed',
      suggestions: [
        'Check your API key is correct',
        'Verify your API key has not expired',
        'Ensure you have sufficient credits',
        'Update your API key in AI Configuration'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Rate limiting errors
  if (errorMessage.includes('429') || 
      errorMessage.includes('rate limit') ||
      errorMessage.includes('too many requests')) {
    return {
      type: 'rate_limit',
      severity: 'medium',
      message: 'Rate limit exceeded',
      suggestions: [
        'Wait a few minutes before trying again',
        'Reduce the frequency of requests',
        'Check your usage limits',
        'Consider upgrading your plan'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Configuration errors
  if (errorMessage.includes('invalid configuration') ||
      errorMessage.includes('AI configuration is invalid') ||
      errorMessage.includes('model not found') ||
      errorMessage.includes('invalid model') ||
      errorMessage.includes('configuration error')) {
    return {
      type: 'invalid_config',
      severity: 'high',
      message: 'Invalid AI configuration',
      suggestions: [
        'Check your AI model name is correct',
        'Verify all required fields are filled',
        'Update your AI Configuration',
        'Test your configuration'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Parsing errors
  if (errorMessage.includes('parsing') ||
      errorMessage.includes('parse') ||
      errorMessage.includes('invalid response') ||
      errorMessage.includes('failed to parse')) {
    return {
      type: 'parsing',
      severity: 'medium',
      message: 'Failed to parse AI response',
      suggestions: [
        'Try rephrasing your question',
        'Use simpler language',
        'Break down complex requests',
        'Try again with a different question'
      ],
      technicalDetails: errorMessage
    };
  }
  
  // Unknown errors
  return {
    type: 'unknown',
    severity: 'medium',
    message: 'Unknown error occurred',
    suggestions: [
      'Try again in a few moments',
      'Check your AI configuration',
      'Contact support if the problem persists',
      'Review the error details below'
    ],
    technicalDetails: errorMessage
  };
};

export const getAIErrorIcon = (type: AIErrorAnalysis['type']): string => {
  switch (type) {
    case 'network': return '🌐';
    case 'authentication': return '🔐';
    case 'rate_limit': return '⚡';
    case 'invalid_config': return '⚙️';
    case 'parsing': return '📝';
    default: return '❓';
  }
};

export const getAIErrorColor = (severity: AIErrorAnalysis['severity']): string => {
  switch (severity) {
    case 'low': return '#28a745';
    case 'medium': return '#ffc107';
    case 'high': return '#fd7e14';
    case 'critical': return '#dc3545';
    default: return '#6c757d';
  }
};