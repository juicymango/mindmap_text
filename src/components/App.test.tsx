
import { render } from '@testing-library/react';
import { App } from './App';

jest.mock('./Toolbar', () => ({
  Toolbar: () => <div data-testid="toolbar" />,
}));

jest.mock('./MindMap', () => ({
  MindMap: () => <div data-testid="mindmap" />,
}));

describe('App', () => {
  it('should render Toolbar and MindMap', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('toolbar')).toBeInTheDocument();
    expect(getByTestId('mindmap')).toBeInTheDocument();
  });
});
