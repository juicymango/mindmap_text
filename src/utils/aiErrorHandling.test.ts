import { analyzeAIError, getAIErrorIcon, getAIErrorColor, AIErrorAnalysis } from './aiErrorHandling';

describe('AI Error Handling', () => {
  describe('analyzeAIError', () => {
    it('should analyze network errors', () => {
      const error = new Error('Network Error: Failed to fetch');
      const analysis = analyzeAIError(error);
      
      expect(analysis.type).toBe('network');
      expect(analysis.severity).toBe('medium');
      expect(analysis.message).toBe('Network connection error');
      expect(analysis.suggestions).toContain('Check your internet connection');
    });

    it('should analyze authentication errors', () => {
      const error = new Error('401 Unauthorized - Invalid API key');
      const analysis = analyzeAIError(error);
      
      expect(analysis.type).toBe('authentication');
      expect(analysis.severity).toBe('high');
      expect(analysis.message).toBe('Authentication failed');
      expect(analysis.suggestions).toContain('Check your API key is correct');
    });

    it('should analyze rate limit errors', () => {
      const error = new Error('429 Too Many Requests - Rate limit exceeded');
      const analysis = analyzeAIError(error);
      
      expect(analysis.type).toBe('rate_limit');
      expect(analysis.severity).toBe('medium');
      expect(analysis.message).toBe('Rate limit exceeded');
      expect(analysis.suggestions).toContain('Wait a few minutes before trying again');
    });

    it('should analyze configuration errors', () => {
      const error = new Error('AI configuration is invalid - model not found');
      const analysis = analyzeAIError(error);
      
      expect(analysis.type).toBe('invalid_config');
      expect(analysis.severity).toBe('high');
      expect(analysis.message).toBe('Invalid AI configuration');
      expect(analysis.suggestions).toContain('Check your AI model name is correct');
    });

    it('should analyze parsing errors', () => {
      const error = new Error('Failed to parse AI response - invalid format');
      const analysis = analyzeAIError(error);
      
      expect(analysis.type).toBe('parsing');
      expect(analysis.severity).toBe('medium');
      expect(analysis.message).toBe('Failed to parse AI response');
      expect(analysis.suggestions).toContain('Try rephrasing your question');
    });

    it('should analyze unknown errors', () => {
      const error = new Error('Something completely unexpected happened');
      const analysis = analyzeAIError(error);
      
      expect(analysis.type).toBe('unknown');
      expect(analysis.severity).toBe('medium');
      expect(analysis.message).toBe('Unknown error occurred');
      expect(analysis.suggestions).toContain('Try again in a few moments');
    });

    it('should handle string errors', () => {
      const error = 'Network Error: ECONNREFUSED';
      const analysis = analyzeAIError(error);
      
      expect(analysis.type).toBe('network');
      expect(analysis.severity).toBe('medium');
    });

    it('should include technical details', () => {
      const error = new Error('401 Unauthorized - Invalid API key');
      const analysis = analyzeAIError(error);
      
      expect(analysis.technicalDetails).toBe('401 Unauthorized - Invalid API key');
    });
  });

  describe('getAIErrorIcon', () => {
    it('should return correct icon for each error type', () => {
      expect(getAIErrorIcon('network')).toBe('🌐');
      expect(getAIErrorIcon('authentication')).toBe('🔐');
      expect(getAIErrorIcon('rate_limit')).toBe('⚡');
      expect(getAIErrorIcon('invalid_config')).toBe('⚙️');
      expect(getAIErrorIcon('parsing')).toBe('📝');
      expect(getAIErrorIcon('unknown')).toBe('❓');
    });
  });

  describe('getAIErrorColor', () => {
    it('should return correct color for each severity', () => {
      expect(getAIErrorColor('low')).toBe('#28a745');
      expect(getAIErrorColor('medium')).toBe('#ffc107');
      expect(getAIErrorColor('high')).toBe('#fd7e14');
      expect(getAIErrorColor('critical')).toBe('#dc3545');
    });
  });

  describe('error type detection', () => {
    it('should detect various network error patterns', () => {
      const networkErrors = [
        'Network Error',
        'fetch failed',
        'ECONNREFUSED',
        'timeout',
        'ERR_NETWORK',
        'Failed to fetch'
      ];

      networkErrors.forEach(errorMsg => {
        const analysis = analyzeAIError(new Error(errorMsg));
        expect(analysis.type).toBe('network');
      });
    });

    it('should detect various authentication error patterns', () => {
      const authErrors = [
        '401',
        'unauthorized',
        'invalid api key',
        'authentication failed',
        'API key invalid',
        'UNAUTHORIZED'
      ];

      authErrors.forEach(errorMsg => {
        const analysis = analyzeAIError(new Error(errorMsg));
        expect(analysis.type).toBe('authentication');
      });
    });

    it('should detect various rate limit error patterns', () => {
      const rateLimitErrors = [
        '429',
        'rate limit',
        'too many requests',
        'RATE_LIMIT_EXCEEDED',
        'quota exceeded'
      ];

      rateLimitErrors.forEach(errorMsg => {
        const analysis = analyzeAIError(new Error(errorMsg));
        expect(analysis.type).toBe('rate_limit');
      });
    });

    it('should detect various configuration error patterns', () => {
      const configErrors = [
        'invalid configuration',
        'AI configuration is invalid',
        'model not found',
        'invalid model',
        'configuration error'
      ];

      configErrors.forEach(errorMsg => {
        const analysis = analyzeAIError(new Error(errorMsg));
        expect(analysis.type).toBe('invalid_config');
      });
    });

    it('should detect various parsing error patterns', () => {
      const parsingErrors = [
        'parsing error',
        'parse failed',
        'invalid response',
        'failed to parse',
        'JSON parsing error'
      ];

      parsingErrors.forEach(errorMsg => {
        const analysis = analyzeAIError(new Error(errorMsg));
        expect(analysis.type).toBe('parsing');
      });
    });
  });

  describe('suggestion quality', () => {
    it('should provide relevant suggestions for each error type', () => {
      const errorTypes = ['network', 'authentication', 'rate_limit', 'invalid_config', 'parsing', 'unknown'] as const;
      
      errorTypes.forEach(type => {
        const error = new Error(getErrorMessageForType(type));
        const analysis = analyzeAIError(error);
        
        expect(analysis.suggestions.length).toBeGreaterThan(0);
        expect(analysis.suggestions.length).toBeLessThanOrEqual(4);
        
        // Suggestions should be actionable
        analysis.suggestions.forEach(suggestion => {
          expect(suggestion.length).toBeGreaterThan(0);
          expect(suggestion).toMatch(/^[A-Z]/); // Should start with capital letter
        });
      });
    });

    function getErrorMessageForType(type: string): string {
      switch (type) {
        case 'network': return 'Network Error';
        case 'authentication': return '401 Unauthorized';
        case 'rate_limit': return '429 Too Many Requests';
        case 'invalid_config': return 'Invalid configuration';
        case 'parsing': return 'Parsing error';
        default: return 'Unknown error';
      }
    }
  });
});