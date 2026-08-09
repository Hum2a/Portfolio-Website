import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

test('renders homepage heading', () => {
  render(<RouterProvider router={router} />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toBeInTheDocument();
});
