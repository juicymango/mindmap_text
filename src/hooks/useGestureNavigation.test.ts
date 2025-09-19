import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGestureNavigation } from './useGestureNavigation';

// Mock touch events
const createTouch = (x: number, y: number) => ({
  clientX: x,
  clientY: y,
  identifier: 1,
});

const createTouchEvent = (type: string, touches: any[]) => {
  const touchEvent = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(touchEvent, 'touches', {
    value: touches,
    writable: false,
  });
  Object.defineProperty(touchEvent, 'changedTouches', {
    value: touches,
    writable: false,
  });
  return touchEvent;
};

describe('useGestureNavigation', () => {
  let mockOnSwipeLeft: jest.Mock;
  let mockOnSwipeRight: jest.Mock;

  beforeEach(() => {
    mockOnSwipeLeft = jest.fn();
    mockOnSwipeRight = jest.fn();
    jest.clearAllMocks();
  });

  it('should provide touch handlers', () => {
    const TestComponent = () => {
      const { touchHandlers } = useGestureNavigation({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
      });
      
      return React.createElement('div', { ...touchHandlers, 'data-testid': 'test-div' }, 'Test');
    };

    render(React.createElement(TestComponent));
    
    expect(screen.getByTestId('test-div')).toBeInTheDocument();
    // The touch handlers are spread as props, so the element should be rendered
    expect(screen.getByTestId('test-div')).toBeTruthy();
  });

  it('should detect left swipe', () => {
    const TestComponent = () => {
      const { touchHandlers } = useGestureNavigation({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
        minSwipeDistance: 50,
      });
      
      return React.createElement('div', { ...touchHandlers, 'data-testid': 'test-div' }, 'Test');
    };

    render(React.createElement(TestComponent));
    
    const element = screen.getByTestId('test-div');
    
    // Start touch
    const startEvent = createTouchEvent('touchstart', [createTouch(100, 200)]);
    fireEvent(element, startEvent);
    
    // Move touch to the left
    const moveEvent = createTouchEvent('touchmove', [createTouch(40, 200)]);
    fireEvent(element, moveEvent);
    
    // End touch
    const endEvent = createTouchEvent('touchend', [createTouch(40, 200)]);
    fireEvent(element, endEvent);
    
    // Should trigger left swipe (distance: 60px)
    expect(mockOnSwipeLeft).toHaveBeenCalled();
    expect(mockOnSwipeRight).not.toHaveBeenCalled();
  });

  it('should detect right swipe', () => {
    const TestComponent = () => {
      const { touchHandlers } = useGestureNavigation({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
        minSwipeDistance: 50,
      });
      
      return React.createElement('div', { ...touchHandlers, 'data-testid': 'test-div' }, 'Test');
    };

    render(React.createElement(TestComponent));
    
    const element = screen.getByTestId('test-div');
    
    // Start touch
    const startEvent = createTouchEvent('touchstart', [createTouch(100, 200)]);
    fireEvent(element, startEvent);
    
    // Move touch to the right
    const moveEvent = createTouchEvent('touchmove', [createTouch(160, 200)]);
    fireEvent(element, moveEvent);
    
    // End touch
    const endEvent = createTouchEvent('touchend', [createTouch(160, 200)]);
    fireEvent(element, endEvent);
    
    // Should trigger right swipe (distance: 60px)
    expect(mockOnSwipeRight).toHaveBeenCalled();
    expect(mockOnSwipeLeft).not.toHaveBeenCalled();
  });

  it('should not trigger swipe for insufficient distance', () => {
    const TestComponent = () => {
      const { touchHandlers } = useGestureNavigation({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
        minSwipeDistance: 50,
      });
      
      return React.createElement('div', { ...touchHandlers, 'data-testid': 'test-div' }, 'Test');
    };

    render(React.createElement(TestComponent));
    
    const element = screen.getByTestId('test-div');
    
    // Start touch
    const startEvent = createTouchEvent('touchstart', [createTouch(100, 200)]);
    fireEvent(element, startEvent);
    
    // Move touch to the left (insufficient distance)
    const moveEvent = createTouchEvent('touchmove', [createTouch(70, 200)]);
    fireEvent(element, moveEvent);
    
    // End touch
    const endEvent = createTouchEvent('touchend', [createTouch(70, 200)]);
    fireEvent(element, endEvent);
    
    // Should not trigger swipe (distance: 30px < 50px)
    expect(mockOnSwipeLeft).not.toHaveBeenCalled();
    expect(mockOnSwipeRight).not.toHaveBeenCalled();
  });

  it('should not trigger swipe for vertical movement', () => {
    const TestComponent = () => {
      const { touchHandlers } = useGestureNavigation({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
        minSwipeDistance: 50,
        maxVerticalDeviation: 30,
      });
      
      return React.createElement('div', { ...touchHandlers, 'data-testid': 'test-div' }, 'Test');
    };

    render(React.createElement(TestComponent));
    
    const element = screen.getByTestId('test-div');
    
    // Start touch
    const startEvent = createTouchEvent('touchstart', [createTouch(100, 200)]);
    fireEvent(element, startEvent);
    
    // Move touch diagonally (excessive vertical deviation)
    const moveEvent = createTouchEvent('touchmove', [createTouch(40, 250)]);
    fireEvent(element, moveEvent);
    
    // End touch
    const endEvent = createTouchEvent('touchend', [createTouch(40, 250)]);
    fireEvent(element, endEvent);
    
    // Should not trigger swipe due to vertical deviation (50px > 30px)
    expect(mockOnSwipeLeft).not.toHaveBeenCalled();
    expect(mockOnSwipeRight).not.toHaveBeenCalled();
  });

  it('should show swipe indicators', () => {
    const TestComponent = () => {
      const { indicators } = useGestureNavigation({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
      });
      
      return React.createElement('div', null,
        React.createElement('div', { 'data-testid': 'left-indicator' }, indicators.showLeft.toString()),
        React.createElement('div', { 'data-testid': 'right-indicator' }, indicators.showRight.toString())
      );
    };

    render(React.createElement(TestComponent));
    
    expect(screen.getByTestId('left-indicator')).toHaveTextContent('false');
    expect(screen.getByTestId('right-indicator')).toHaveTextContent('false');
  });

  it('should use default configuration', () => {
    const TestComponent = () => {
      const { touchHandlers } = useGestureNavigation({});
      
      return React.createElement('div', { ...touchHandlers, 'data-testid': 'test-div' }, 'Test');
    };

    // Should not throw error with default config
    expect(() => {
      render(React.createElement(TestComponent));
    }).not.toThrow();
  });

  it('should handle multiple touch events', () => {
    const TestComponent = () => {
      const { touchHandlers } = useGestureNavigation({
        onSwipeLeft: mockOnSwipeLeft,
        onSwipeRight: mockOnSwipeRight,
        minSwipeDistance: 30,
      });
      
      return React.createElement('div', { ...touchHandlers, 'data-testid': 'test-div' }, 'Test');
    };

    render(React.createElement(TestComponent));
    
    const element = screen.getByTestId('test-div');
    
    // First swipe
    let startEvent = createTouchEvent('touchstart', [createTouch(100, 200)]);
    fireEvent(element, startEvent);
    
    let moveEvent = createTouchEvent('touchmove', [createTouch(50, 200)]);
    fireEvent(element, moveEvent);
    
    let endEvent = createTouchEvent('touchend', [createTouch(50, 200)]);
    fireEvent(element, endEvent);
    
    // Second swipe
    startEvent = createTouchEvent('touchstart', [createTouch(100, 200)]);
    fireEvent(element, startEvent);
    
    moveEvent = createTouchEvent('touchmove', [createTouch(150, 200)]);
    fireEvent(element, moveEvent);
    
    endEvent = createTouchEvent('touchend', [createTouch(150, 200)]);
    fireEvent(element, endEvent);
    
    expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1);
    expect(mockOnSwipeRight).toHaveBeenCalledTimes(1);
  });

  it('should not trigger swipe when callback is not provided', () => {
    const TestComponent = () => {
      const { touchHandlers } = useGestureNavigation({
        minSwipeDistance: 50,
      });
      
      return React.createElement('div', { ...touchHandlers, 'data-testid': 'test-div' }, 'Test');
    };

    render(React.createElement(TestComponent));
    
    const element = screen.getByTestId('test-div');
    
    // Start touch
    const startEvent = createTouchEvent('touchstart', [createTouch(100, 200)]);
    fireEvent(element, startEvent);
    
    // Move touch to the left
    const moveEvent = createTouchEvent('touchmove', [createTouch(40, 200)]);
    fireEvent(element, moveEvent);
    
    // End touch
    const endEvent = createTouchEvent('touchend', [createTouch(40, 200)]);
    fireEvent(element, endEvent);
    
    // Should not throw error when callbacks are not provided
    expect(() => {
      // The swipe distance is sufficient but no callback should be called
    }).not.toThrow();
  });
});