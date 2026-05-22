import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home navigation link', () => {
  render(<App />);
  const homeElements = screen.getAllByText(/home/i);
  expect(homeElements.length).toBeGreaterThan(0);
});
