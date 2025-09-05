import { detectFormat } from './file';

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
});