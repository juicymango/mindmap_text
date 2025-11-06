import { detectFormat, saveAsFile, sanitizeFilename, generateFilenameFromRoot } from './file';
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

  // Task 58: Root Node Filename Feature Tests
  describe('sanitizeFilename', () => {
    it('should handle empty string', () => {
      expect(sanitizeFilename('')).toBe('');
      expect(sanitizeFilename('   ')).toBe('');
    });

    it('should remove special characters', () => {
      expect(sanitizeFilename('My<File>Name')).toBe('MyFileName');
      expect(sanitizeFilename('Test:With"Quotes')).toBe('TestWithQuotes');
      expect(sanitizeFilename('Path/To\\File|Name*?')).toBe('PathToFileName');
      expect(sanitizeFilename('File With Spaces')).toBe('File With Spaces');
    });

    it('should handle multiple spaces', () => {
      expect(sanitizeFilename('File   With    Multiple   Spaces')).toBe('File With Multiple Spaces');
    });

    it('should remove leading and trailing dots', () => {
      expect(sanitizeFilename('...filename...')).toBe('filename');
      expect(sanitizeFilename('.hiddenfile')).toBe('hiddenfile');
    });

    it('should handle reserved names', () => {
      expect(sanitizeFilename('CON')).toBe('CON_mindmap');
      expect(sanitizeFilename('PRN')).toBe('PRN_mindmap');
      expect(sanitizeFilename('AUX')).toBe('AUX_mindmap');
      expect(sanitizeFilename('NUL')).toBe('NUL_mindmap');
      expect(sanitizeFilename('COM1')).toBe('COM1_mindmap');
      expect(sanitizeFilename('con')).toBe('con_mindmap'); // Case insensitive
    });

    it('should handle normal text', () => {
      expect(sanitizeFilename('Normal_File-Name.txt')).toBe('Normal_File-Name.txt');
      expect(sanitizeFilename('MyMindMap')).toBe('MyMindMap');
      expect(sanitizeFilename('Project Plan 2024')).toBe('Project Plan 2024');
    });
  });

  describe('generateFilenameFromRoot', () => {
    it('should generate filename with normal root text', () => {
      expect(generateFilenameFromRoot('My Project', 'json')).toBe('My Project.json');
      expect(generateFilenameFromRoot('My Project', 'text')).toBe('My Project.txt');
    });

    it('should sanitize and truncate very long root text', () => {
      const longText = 'A'.repeat(150);
      const result = generateFilenameFromRoot(longText, 'json');
      expect(result.length).toBeLessThanOrEqual(104); // 100 chars + '.json'
      expect(result).toBe('A'.repeat(95) + '.json');
    });

    it('should fallback to "mindmap" for empty or whitespace root text', () => {
      expect(generateFilenameFromRoot('', 'json')).toBe('mindmap.json');
      expect(generateFilenameFromRoot('   ', 'text')).toBe('mindmap.txt');
      expect(generateFilenameFromRoot('\t\n', 'json')).toBe('mindmap.json');
    });

    it('should handle special characters in root text', () => {
      expect(generateFilenameFromRoot('My<Project>Plan', 'json')).toBe('MyProjectPlan.json');
      expect(generateFilenameFromRoot('File:With/Special*Chars', 'text')).toBe('FileWithSpecialChars.txt');
    });

    it('should handle reserved names', () => {
      expect(generateFilenameFromRoot('CON', 'json')).toBe('CON_mindmap.json');
      expect(generateFilenameFromRoot('PRN', 'text')).toBe('PRN_mindmap.txt');
    });

    it('should handle mixed characters', () => {
      expect(generateFilenameFromRoot('Project <Test> 2024', 'json')).toBe('Project Test 2024.json');
      expect(generateFilenameFromRoot('  My:File|Name*  ', 'text')).toBe('MyFileName.txt');
    });

    it('should handle edge cases', () => {
      expect(generateFilenameFromRoot('...HiddenFile...', 'json')).toBe('HiddenFile.json');
      expect(generateFilenameFromRoot('File   With   Spaces', 'text')).toBe('File With Spaces.txt');
      expect(generateFilenameFromRoot('Normal-File_Name.123', 'json')).toBe('Normal-File_Name.123.json');
    });
  });

  describe('saveAsFile with root text', () => {
    let mockMindMap: MindMap;
    let mockCreateElement: jest.SpyInstance;
    let mockClick: jest.Mock;
    let mockRevokeObjectURL: jest.Mock;

    beforeEach(() => {
      mockMindMap = {
        root: {
          text: 'My Project',
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
      jest.restoreAllMocks();
    });

    it('should use root text for JSON filename', async () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      await saveAsFile(mockMindMap, 'json', 'My Project');

      expect(mockAnchor.download).toBe('My Project.json');
      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });

    it('should use root text for Text filename', async () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      await saveAsFile(mockMindMap, 'text', 'My Project');

      expect(mockAnchor.download).toBe('My Project.txt');
      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });

    it('should fallback to default when root text is not provided', async () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      await saveAsFile(mockMindMap, 'json');

      expect(mockAnchor.download).toBe('mindmap.json');
      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });

    it('should sanitize root text in filename', async () => {
      const mockAnchor = {
        href: '',
        download: '',
        click: mockClick
      };
      mockCreateElement.mockReturnValue(mockAnchor as any);

      await saveAsFile(mockMindMap, 'json', 'My<Project>Plan');

      expect(mockAnchor.download).toBe('MyProjectPlan.json');
      expect(mockCreateElement).toHaveBeenCalledWith('a');
    });
  });
});