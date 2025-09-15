
import { render, screen } from '@testing-library/react';
import { App } from './App';

jest.mock('./Toolbar', () => ({
  Toolbar: () => <div data-testid="toolbar" />,
}));

jest.mock('./MindMap', () => ({
  MindMap: () => <div data-testid="mindmap" />,
}));

describe('App', () => {
  it('should render Toolbar and MindMap', () => {
    render(<App />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('mindmap')).toBeInTheDocument();
  });
});
