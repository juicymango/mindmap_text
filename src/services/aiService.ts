import { AIConfig, AI_PROVIDERS } from '../config/ai';
import { MindNode } from '../types';
import { textToMindMap } from '../utils/textFormat';

export interface AIRequest {
  question: string;
  context: {
    selectedNode: string;
    parentNodes: string[];
    mindMapContext: string;
  };
}

export interface AIResponse {
  content: string;
  structure: MindNode[];
  error?: string;
}

export class AIService {
  private config: AIConfig;
  private providerConfig: typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

  constructor(config: AIConfig) {
    this.config = config;
    this.providerConfig = AI_PROVIDERS[config.provider];
  }

  async generateContent(request: AIRequest): Promise<AIResponse> {
    try {
      const prompt = this.buildPrompt(request);
      const response = await this.callAI(prompt);
      const structure = this.parseResponseToMindMap(response);
      
      return {
        content: response,
        structure,
      };
    } catch (error) {
      return {
        content: '',
        structure: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private buildPrompt(request: AIRequest): string {
    return `
You are an AI assistant that helps create mind maps. Based on the user's question and the current mind map context, generate a structured response that can be organized as a mind map.

Context:
- Selected Node: ${request.context.selectedNode}
- Parent Nodes: ${request.context.parentNodes.join(' → ')}
- Mind Map Structure: ${request.context.mindMapContext}

User Question: ${request.question}

Please provide your response in a hierarchical format that can be parsed into a mind map structure. Use the following format:
Main Topic
    Subtopic 1
        Detail 1
        Detail 2
    Subtopic 2
        Detail 3
    Subtopic 3

Ensure the response is well-structured and directly addresses the user's question within the given context.
`;
  }

  private async callAI(prompt: string): Promise<string> {
    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'anthropic':
        return this.callAnthropic(prompt);
      case 'deepseek':
        return this.callDeepSeek(prompt);
      case 'glm':
        return this.callGLM(prompt);
      case 'kimi':
        return this.callKimi(prompt);
      case 'qwen':
        return this.callQwen(prompt);
      case 'local':
        return this.callLocalAI(prompt);
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  private async callLocalAI(prompt: string): Promise<string> {
    if (!this.config.baseUrl) {
      throw new Error('Base URL is required for local AI provider');
    }

    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Local AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callDeepSeek(prompt: string): Promise<string> {
    const response = await fetch(`${this.providerConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callGLM(prompt: string): Promise<string> {
    const response = await fetch(`${this.providerConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`GLM API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callKimi(prompt: string): Promise<string> {
    const response = await fetch(`${this.providerConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callQwen(prompt: string): Promise<string> {
    if (!this.providerConfig.baseUrl) {
      throw new Error('Base URL is required for Qwen provider');
    }

    const response = await fetch(this.providerConfig.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        input: {
          messages: [{ role: 'user', content: prompt }],
        },
        parameters: {
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.output?.text || '';
  }

  private parseResponseToMindMap(response: string): MindNode[] {
    const lines = response.split('\n').filter(line => line.trim());
    const mindMap = textToMindMap(lines.join('\n'));
    return mindMap?.root.children || [];
  }
}