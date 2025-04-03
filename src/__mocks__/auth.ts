export const useAuth = jest.fn().mockReturnValue({
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
  },
  session: {
    access_token: 'test-token',
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
    },
  },
  signOut: jest.fn().mockResolvedValue(undefined),
  loading: false,
  error: null,
}); 