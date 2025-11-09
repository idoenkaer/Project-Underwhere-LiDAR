import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Smoke Test', () => {
  it('renders the main application without crashing', () => {
    // Mock sessionStorage
    const mockSessionStorage = {
      getItem: () => 'true',
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
    });
    
    render(<App />);
    
    // Check for a key element that should be present, like the header title.
    // The title changes, so we look for a more static element like the SCAN_ID label.
    const scanIdLabel = screen.getByText(/SCAN_ID:/i);
    expect(scanIdLabel).toBeInTheDocument();
  });
});
