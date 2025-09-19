import React from 'react';
import { render, screen } from '@testing-library/react';
import { useMobileDetection } from './useMobileDetection';

// Mock window object
const mockWindow = {
  innerWidth: 1024,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

describe('useMobileDetection', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the window object
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: mockWindow.innerWidth,
    });
    
    window.addEventListener = mockWindow.addEventListener;
    window.removeEventListener = mockWindow.removeEventListener;
  });

  it('should return false for desktop screen width', () => {
    // Set desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const TestComponent = () => {
      const { isMobile } = useMobileDetection();
      return React.createElement('div', { 'data-testid': 'is-mobile' }, isMobile.toString());
    };

    render(React.createElement(TestComponent));
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
  });

  it('should return true for mobile screen width', () => {
    // Set mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const TestComponent = () => {
      const { isMobile } = useMobileDetection();
      return React.createElement('div', { 'data-testid': 'is-mobile' }, isMobile.toString());
    };

    render(React.createElement(TestComponent));
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
  });

  it('should handle window resize events', () => {
    // Test that the hook adds and removes event listeners properly
    const TestComponent = () => {
      const { isMobile } = useMobileDetection();
      return React.createElement('div', { 'data-testid': 'is-mobile' }, isMobile.toString());
    };

    const { unmount } = render(React.createElement(TestComponent));
    
    // Check if resize event listener was added
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    
    // Unmount component
    unmount();
    
    // Check if resize event listener was removed
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should use 768px as breakpoint', () => {
    // Test exactly at breakpoint (should be mobile)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const TestComponent = () => {
      const { isMobile } = useMobileDetection();
      return React.createElement('div', { 'data-testid': 'is-mobile' }, isMobile.toString());
    };

    render(React.createElement(TestComponent));
    
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
  });

  it('should add and remove event listeners', () => {
    const TestComponent = () => {
      useMobileDetection();
      return React.createElement('div', null, 'Test');
    };

    const { unmount } = render(React.createElement(TestComponent));
    
    // Check if event listener was added
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    
    // Unmount component
    unmount();
    
    // Check if event listener was removed
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});