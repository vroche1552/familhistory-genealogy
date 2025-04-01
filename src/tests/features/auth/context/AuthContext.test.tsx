import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '@/features/auth/context/AuthContext';
import { useContext } from 'react';

// Test component to access context
function TestComponent() {
  const context = useContext(AuthContext);
  return <div data-testid="test-component">{JSON.stringify(context)}</div>;
}

describe('AuthContext', () => {
  // Expected use case
  it('should login user successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const context = JSON.parse(screen.getByTestId('test-component').textContent || '{}');

    await act(async () => {
      await context.login('test@example.com', 'password');
    });

    expect(context.user).toEqual({
      id: '1',
      email: 'test@example.com',
      name: 'John Doe'
    });
    expect(context.isAuthenticated).toBe(true);
  });

  // Edge case
  it('should handle empty user data in localStorage', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'user') return '{}';
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const context = JSON.parse(screen.getByTestId('test-component').textContent || '{}');

    await waitFor(() => {
      expect(context.user).toBeNull();
      expect(context.isAuthenticated).toBe(false);
    });
  });

  // Failure case
  it('should handle login failure', async () => {
    // Mock console.error to prevent test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const context = JSON.parse(screen.getByTestId('test-component').textContent || '{}');

    await act(async () => {
      try {
        await context.login('invalid@example.com', 'wrongpassword');
      } catch (error) {
        // Expected error
      }
    });

    expect(context.user).toBeNull();
    expect(context.isAuthenticated).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });
}); 