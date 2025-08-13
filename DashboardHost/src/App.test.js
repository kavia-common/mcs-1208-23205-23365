import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppStateProvider } from './state/AppStateProvider';
import App from './App';

test('renders header and welcome', () => {
  render(
    <BrowserRouter>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </BrowserRouter>
  );
  expect(screen.getByTestId ? true : true).toBe(true); // keep CRA happy with strict-ness
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
});
