import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAPI, getToken, setToken, isAuthenticated } from '../../composables/useAPI';

describe('useAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Token management', () => {
    it('should get token from localStorage', () => {
      localStorage.setItem('metgo3d-api-token', 'test-token-123');
      expect(getToken()).toBe('test-token-123');
    });

    it('should return null when no token exists', () => {
      expect(getToken()).toBeNull();
    });

    it('should set token in localStorage', () => {
      setToken('new-token-456');
      expect(localStorage.getItem('metgo3d-api-token')).toBe('new-token-456');
    });

    it('should remove token when setting null', () => {
      localStorage.setItem('metgo3d-api-token', 'old-token');
      setToken(null);
      expect(localStorage.getItem('metgo3d-api-token')).toBeNull();
    });

    it('should check authentication status', () => {
      expect(isAuthenticated()).toBe(false);
      setToken('test-token');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('HTTP Methods', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true, data: { message: 'Success' } })
      });
    });

    it('should make GET request', async () => {
      const api = useAPI();
      const result = await api.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual({ success: true, data: { message: 'Success' } });
    });

    it('should make POST request with body', async () => {
      const api = useAPI();
      const testData = { name: 'Test CV', email: 'test@example.com' };
      await api.post('/cvs', testData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cvs'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(testData)
        })
      );
    });

    it('should make PUT request with body', async () => {
      const api = useAPI();
      const updateData = { name: 'Updated CV' };
      await api.put('/cvs/123', updateData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cvs/123'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
      );
    });

    it('should make PATCH request', async () => {
      const api = useAPI();
      await api.patch('/cvs/123', { status: 'active' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    it('should make DELETE request', async () => {
      const api = useAPI();
      await api.del('/cvs/123');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('Authentication headers', () => {
    it('should include Authorization header when token exists', async () => {
      setToken('bearer-token-123');
      
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ data: {} })
      });

      const api = useAPI();
      await api.get('/protected');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer bearer-token-123'
          })
        })
      );
    });

    it('should not include Authorization header without token', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ data: {} })
      });

      const api = useAPI();
      await api.get('/public');

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });
  });

  describe('Loading state', () => {
    it('should set loading to true during request', async () => {
      let loadingDuringRequest = false;

      global.fetch.mockImplementation(async () => {
        loadingDuringRequest = api.loading.value;
        return {
          ok: true,
          headers: new Map([['content-type', 'application/json']]),
          json: async () => ({ data: {} })
        };
      });

      const api = useAPI();
      expect(api.loading.value).toBe(false);
      
      await api.get('/test');
      
      expect(loadingDuringRequest).toBe(true);
      expect(api.loading.value).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should handle HTTP error responses', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ error: 'Bad Request', message: 'Invalid data' })
      });

      const api = useAPI();
      
      await expect(api.get('/test')).rejects.toThrow('Invalid data');
      expect(api.error.value).toBe('Invalid data');
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const api = useAPI();
      
      await expect(api.get('/test')).rejects.toThrow('Network error');
      expect(api.error.value).toBe('Network error');
    });

    it('should handle 401 token expired', async () => {
      const mockLocationHref = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true
      });

      setToken('expired-token');

      global.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ code: 'TOKEN_EXPIRED', message: 'Token expired' })
      });

      const api = useAPI();
      
      await expect(api.get('/protected')).rejects.toThrow();
      expect(getToken()).toBeNull();
    });

    it('should clear error manually', () => {
      const api = useAPI();
      api.error.value = 'Some error';
      
      api.clearError();
      
      expect(api.error.value).toBeNull();
    });
  });

  describe('Response handling', () => {
    it('should parse JSON responses', async () => {
      const responseData = { id: 1, name: 'Test CV' };
      
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => responseData
      });

      const api = useAPI();
      const result = await api.get('/cvs/1');
      
      expect(result).toEqual(responseData);
    });

    it('should handle non-JSON responses', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'text/plain']]),
        text: async () => 'Plain text response'
      });

      const api = useAPI();
      const result = await api.get('/download');
      
      expect(result).toEqual({ message: 'Plain text response' });
    });

    it('should handle FormData without JSON stringifying', async () => {
      const formData = new FormData();
      formData.append('file', 'test.pdf');

      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ success: true })
      });

      const api = useAPI();
      await api.post('/upload', formData);

      const callArgs = global.fetch.mock.calls[0][1];
      expect(callArgs.body).toBeInstanceOf(FormData);
    });
  });

  describe('API URL configuration', () => {
    it('should use configured API URL', () => {
      const api = useAPI();
      expect(api.apiUrl).toBeDefined();
      expect(typeof api.apiUrl).toBe('string');
    });

    it('should handle absolute URLs', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ data: {} })
      });

      const api = useAPI();
      await api.get('https://external-api.com/endpoint');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://external-api.com/endpoint',
        expect.any(Object)
      );
    });
  });
});
