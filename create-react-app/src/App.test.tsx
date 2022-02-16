import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders learn react link and button', async () => {
  render(<App />);
  const linkElement = screen.getByText(/clarity in react/i);
  expect(linkElement).toBeInTheDocument();

  const buttonElement = await screen.findByRole('button', { name: 'Show Alert' });
  expect(buttonElement).toBeInTheDocument();
});
