import { mindMapToText, textToMindMap } from './textFormat';
import { MindMap } from '../types';

describe('textFormat', () => {
  describe('mindMapToText', () => {
    it('should convert a mind map to text', () => {
      const mindMap: MindMap = {
        root: {
          text: 'Root',
          children: [
            {
              text: 'Child 1',
              children: [
                { text: 'Grandchild 1', children: [] },
              ],
            },
            { text: 'Child 2', children: [] },
          ],
        },
      };
      const expectedText = 'Root\n\tChild 1\n\t\tGrandchild 1\n\tChild 2';
      expect(mindMapToText(mindMap)).toBe(expectedText);
    });
  });

  describe('textToMindMap', () => {
    it('should convert text to a mind map', () => {
      const text = 'Root\n\tChild 1\n\t\tGrandchild 1\n\tChild 2';
      const expectedMindMap: MindMap = {
        root: {
          text: 'Root',
          children: [
            {
              text: 'Child 1',
              children: [
                { text: 'Grandchild 1', children: [] },
              ],
            },
            { text: 'Child 2', children: [] },
          ],
        },
      };
      expect(textToMindMap(text)).toEqual(expectedMindMap);
    });

    it('should handle empty text', () => {
        const text = '';
        expect(textToMindMap(text)).toBeNull();
    });

    it('should return null for invalid text', () => {
        const text = '\tRoot';
        expect(textToMindMap(text)).toBeNull();
    });
  });
});