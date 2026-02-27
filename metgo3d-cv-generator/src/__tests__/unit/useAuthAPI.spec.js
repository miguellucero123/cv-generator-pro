import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthAPI } from '../../composables/useAuthAPI';
import { getToken, setToken } from '../../composables/useAPI';

// Mock useAPI composable
const mockAPI = {
  loading: { value: false },
  error: { value: null },
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn()
};

vi.mock('../../composables/useAPI', async () => {
  const actual = await vi.importActual('../../composables/useAPI');
  return {
    ...actual,
    useAPI: () => mockAPI
  };
});

describe('useAuthAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockAPI.loading.value = false;
    mockAPI.error.value = null;
  });

  describe('Authentication state', () => {
    it('should initialize with no user', () => {
      const auth = useAuthAPI();
      expect(auth.user.value).toBeNull();
      expect(auth.isLoggedIn.value).toBe(false);
    });

    it('should check logged in status based on token', () => {
      const auth = useAuthAPI();
      expect(auth.isLoggedIn.value).toBe(false);
      
      setToken('test-token');
      const auth2 = useAuthAPI();
      expect(auth2.isLoggedIn.value).toBe(true);
    });
  });

  describe('User registration', () => {
    it('should register new user successfully', async () => {
      mockAPI.post.mockResolvedValue({
        data: {
          token: 'new-user-token',
          user: { id: 1, email: 'newuser@example.com', name: 'New User' }
        }
      });

      const auth = useAuthAPI();
      const result = await auth.register({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      });

      expect(mockAPI.post).toHaveBeenCalledWith('/auth/register', {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      });
      expect(getToken()).toBe('new-user-token');
      expect(auth.user.value).toEqual({ id: 1, email: 'newuser@example.com', name: 'New User' });
    });

    it('should handle registration errors', async () => {
      mockAPI.post.mockRejectedValue(new Error('Email already exists'));

      const auth = useAuthAPI();
      await expect(auth.register({ email: 'existing@example.com' })).rejects.toThrow('Email already exists');
    });
  });

  describe('User login', () => {
    it('should login user with credentials', async () => {
      mockAPI.post.mockResolvedValue({
        data: {
          token: 'login-token-123',
          user: { id: 1, email: 'user@example.com', name: 'Test User' }
        }
      });
      
      const auth = useAuthAPI();
      await auth.login({ email: 'user@example.com', password: 'pass123' });

      expect(mockAPI.post).toHaveBeenCalledWith('/auth/login', {
        email: 'user@example.com',
        password: 'pass123'
      });
      expect(getToken()).toBe('login-token-123');
      expect(auth.user.value.email).toBe('user@example.com');
    });

    it('should handle login failure', async () => {
      mockAPI.post.mockRejectedValue(new Error('Invalid credentials'));

      const auth = useAuthAPI();
      
      await expect(auth.login({ email: 'wrong@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('User logout', () => {
    it('should logout and clear user data', async () => {
      mockAPI.post.mockResolvedValue({ success: true });

      setToken('existing-token');
      const auth = useAuthAPI();
      auth.user.value = { id: 1, email: 'user@example.com' };

      await auth.logout();

      expect(getToken()).toBeNull();
      expect(auth.user.value).toBeNull();
    });

    it('should clear user data even if logout request fails', async () => {
      mockAPI.post.mockRejectedValue(new Error('Server error'));

      setToken('existing-token');
      const auth = useAuthAPI();
      auth.user.value = { id: 1, email: 'user@example.com' };

      // El logout puede fallar pero debe limpiar datos por el finally
      try {
        await auth.logout();
      } catch (error) {
        // Se espera el error pero los datos deben estar limpios
      }

      expect(getToken()).toBeNull();
      expect(auth.user.value).toBeNull();
    });
  });
  describe('Get current user', () => {
    it('should fetch current user data', async () => {
      mockAPI.get.mockResolvedValue({
        data: { user: { id: 3, email: 'current@example.com', name: 'Current User' } }
      });

      const auth = useAuthAPI();
      const result = await auth.getMe();

      expect(mockAPI.get).toHaveBeenCalledWith('/auth/me');
      expect(auth.user.value).toEqual({ id: 3, email: 'current@example.com', name: 'Current User' });
    });
  });

  describe('Update profile', () => {
    it('should update user profile', async () => {
      mockAPI.put.mockResolvedValue({
        data: { user: { id: 1, name: 'Updated Name', email: 'updated@example.com' } }
      });

      const auth = useAuthAPI();
      await auth.updateProfile({ name: 'Updated Name' });

      expect(mockAPI.put).toHaveBeenCalledWith('/auth/profile', { name: 'Updated Name' });
      expect(auth.user.value.name).toBe('Updated Name');
    });
  });

  describe('Change password', () => {
    it('should change password and update token', async () => {
      mockAPI.put.mockResolvedValue({
        data: { token: 'new-password-token', message: 'Password updated' }
      });

      setToken('old-token');
      const auth = useAuthAPI();
      await auth.changePassword({ currentPassword: 'old', newPassword: 'new' });

      expect(mockAPI.put).toHaveBeenCalledWith('/auth/password', {
        currentPassword: 'old',
        newPassword: 'new'
      });
      expect(getToken()).toBe('new-password-token');
    });
  });
  describe('Password recovery', () => {
    it('should send forgot password request', async () => {
      mockAPI.post.mockResolvedValue({
        success: true,
        message: 'Reset email sent'
      });

      const auth = useAuthAPI();
      await auth.forgotPassword('forgot@example.com');

      expect(mockAPI.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'forgot@example.com'
      });
    });

    it('should reset password with token', async () => {
      mockAPI.post.mockResolvedValue({
        success: true,
        message: 'Password reset successful'
      });

      const auth = useAuthAPI();
      await auth.resetPassword('reset-token-123', 'newSecurePassword');

      expect(mockAPI.post).toHaveBeenCalledWith('/auth/reset-password/reset-token-123', {
        password: 'newSecurePassword'
      });
    });
  });

  describe('Initialize from token', () => {
    it('should fetch user data when token exists', async () => {
      mockAPI.get.mockResolvedValue({
        data: { user: { id: 1, email: 'token@example.com' } }
      });

      setToken('existing-token');
      const auth = useAuthAPI();
      auth.initFromToken();

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockAPI.get).toHaveBeenCalledWith('/auth/me');
    });

    it('should clear token on init failure', async () => {
      mockAPI.get.mockRejectedValue(new Error('Invalid token'));

      setToken('invalid-token');
      const auth = useAuthAPI();
      auth.initFromToken();

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(getToken()).toBeNull();
    });

    it('should not fetch user if already loaded', () => {
      setToken('existing-token');
      const auth = useAuthAPI();
      auth.user.value = { id: 1, email: 'loaded@example.com' };

      auth.initFromToken();

      expect(mockAPI.get).not.toHaveBeenCalled();
    });
  });

  describe('Token management methods', () => {
    it('should expose setToken method', () => {
      const auth = useAuthAPI();
      auth.setToken('manual-token');
      expect(getToken()).toBe('manual-token');
    });

    it('should expose getToken method', () => {
      setToken('test-token');
      const auth = useAuthAPI();
      expect(auth.getToken()).toBe('test-token');
    });
  });

  describe('Loading and error states', () => {
    it('should expose loading state from api', () => {
      const auth = useAuthAPI();
      expect(auth.loading.value).toBeDefined();
    });

    it('should expose error state from api', () => {
      const auth = useAuthAPI();
      expect(auth.error.value).toBeDefined();
    });
  });
});
