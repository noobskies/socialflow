import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Check for something we know exists in the initial render, e.g., the sidebar or a heading
    // Since we haven't refactored yet, we can look for "SocialFlow AI" or similar text
    // Adjust this based on what's actually in App.tsx
    expect(screen.getByText(/SocialFlow AI/i)).toBeInTheDocument();
  });
});
