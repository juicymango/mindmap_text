import { detectFormat, saveAsFile } from './file';
import { MindMap } from '../types';

describe('file utils', () => {
  describe('detectFormat', () => {
    it('should detect JSON format', () => {
      expect(detectFormat('file.json')).toBe('json');
      expect(detectFormat('path/to/file.json')).toBe('json');
      expect(detectFormat('FILE.JSON')).toBe('json');
    });

    it('should detect text format', () => {
      expect(detectFormat('file.txt')).toBe('text');
      expect(detectFormat('path/to/file.txt')).toBe('text');
      expect(detectFormat('FILE.TXT')).toBe('text');
    });

    it('should default to JSON for unknown extensions', () => {
      expect(detectFormat('file.unknown')).toBe('json');
      expect(detectFormat('file')).toBe('json');
      expect(detectFormat('file.md')).toBe('json');
    });
  });

  describe('saveAsFile', () => {
    let mockMindMap: MindMap;
    let mockCreateElement: jest.SpyInstance;
    let mockClick: jest.Mock;
    let mockRevokeObjectURL: jest.Mock;

    beforeEach(() => {
      mockMindMap = {
        root: {
          text: 'Root',
          children: [
            { text: 'Child 1', children: [] },
            { text: 'Child 2', children: [] }
          ]
        }
      };

      // Mock URL methods
      mockCreateElement = jest.spyOn(document, 'createElement');
      mockClick = jest.fn();
      mockRevokeObjectURL = jest.fn();
      
      // Mock URL.createObjectURL and URL.revokeObjectURL
      global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
      global.URL.revokeObjectURL = mockRevokeObjectURL;
    });

    afterEach(() => {
      mockCreateElement.mockRestore();
      jest.restoreAllMocks();
    });

    it('should save with default JSON filename when format is json', async () => {
      // Mock createElement to simulate download
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      const result = await saveAsFile(mockMindMap, 'json');

      expect(result).toBe('mindmap.json');
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAnchor.download).toBe('mindmap.json');
      expect(mockAnchor.href).toBe('blob:test-url');
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });

    it('should save with default text filename when format is text', async () => {
      // Mock createElement to simulate download
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      const result = await saveAsFile(mockMindMap, 'text');

      expect(result).toBe('mindmap.txt');
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockAnchor.download).toBe('mindmap.txt');
      expect(mockAnchor.href).toBe('blob:test-url');
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });

    it('should save with default JSON filename when no format specified', async () => {
      // Mock createElement to simulate download
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      const result = await saveAsFile(mockMindMap);

      expect(result).toBe('mindmap.json');
      expect(mockAnchor.download).toBe('mindmap.json');
    });

    it('should create correct blob content for JSON format', async () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      // Mock Blob constructor
      const mockBlob = new Blob(['test'], { type: 'application/json' });
      global.Blob = jest.fn().mockImplementation((content, options) => {
        expect(content[0]).toBe(JSON.stringify(mockMindMap, null, 2));
        expect(options?.type).toBe('application/json');
        return mockBlob;
      }) as any;

      await saveAsFile(mockMindMap, 'json');

      expect(global.Blob).toHaveBeenCalledWith(
        [JSON.stringify(mockMindMap, null, 2)],
        { type: 'application/json' }
      );
    });

    it('should create correct blob content for text format', async () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      // Mock Blob constructor
      const mockBlob = new Blob(['test'], { type: 'text/plain' });
      global.Blob = jest.fn().mockImplementation((content, options) => {
        expect(content[0]).toBe('Child 1\nChild 2'); // Text format excludes auxiliary root
        expect(options?.type).toBe('text/plain');
        return mockBlob;
      }) as any;

      await saveAsFile(mockMindMap, 'text');

      expect(global.Blob).toHaveBeenCalledWith(
        ['Child 1\nChild 2'],
        { type: 'text/plain' }
      );
    });
  });
});