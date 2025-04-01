import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '@/shared/components/layout/Header';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/features/theme/context/ThemeContext';
import { LanguageProvider } from '@/features/i18n/context/LanguageContext';

// Mock the useAuth hook
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Header', () => {
  const renderHeader = (isAuthenticated = false) => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated,
      isLoading: false,
      user: isAuthenticated ? { id: '1', email: 'test@example.com', name: 'Test User' } : null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    });

    return render(
      <MemoryRouter>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <Header />
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </MemoryRouter>
    );
  };

  // Expected use case
  it('should show login and signup buttons when not authenticated', () => {
    renderHeader(false);

    expect(screen.getByText('common.login')).toBeInTheDocument();
    expect(screen.getByText('common.signup')).toBeInTheDocument();
    expect(screen.queryByText('common.dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('common.logout')).not.toBeInTheDocument();
  });

  // Edge case
  it('should handle theme toggle', () => {
    renderHeader(false);

    const themeButton = screen.getByRole('button', { name: /🌙/ });
    fireEvent.click(themeButton);
    expect(screen.getByRole('button', { name: /🌞/ })).toBeInTheDocument();
  });

  // Failure case
  it('should handle logout error gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockLogout = vi.fn().mockImplementation(() => {
      throw new Error('Logout failed');
    });

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      login: vi.fn(),
      signup: vi.fn(),
      logout: mockLogout,
    });

    renderHeader(true);

    const logoutButton = screen.getByText('common.logout');
    fireEvent.click(logoutButton);

    expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
    consoleSpy.mockRestore();
  });
}); 