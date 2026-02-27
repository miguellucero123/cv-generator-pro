import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useShareAPI } from '../../composables/useShareAPI';
import * as cvMapper from '../../utils/cvMapper';

// Mock useAPI composable
const mockAPI = {
  loading: { value: false },
  error: { value: null },
  request: vi.fn(),
  post: vi.fn()
};

vi.mock('../../composables/useAPI', async () => {
  const actual = await vi.importActual('../../composables/useAPI');
  return {
    ...actual,
    useAPI: () => mockAPI
  };
});

// Mock cvMapper utilities
vi.mock('../../utils/cvMapper', () => ({
  mapBackendToFrontend: vi.fn((data) => ({ ...data, _mapped: 'frontend' }))
}));

describe('useShareAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAPI.loading.value = false;
    mockAPI.error.value = null;
  });

  describe('Reactive state', () => {
    it('should initialize publicCV as null', () => {
      const shareAPI = useShareAPI();
      expect(shareAPI.publicCV.value).toBeNull();
    });

    it('should expose loading computed from api', () => {
      mockAPI.loading.value = true;
      const shareAPI = useShareAPI();
      expect(shareAPI.loading.value).toBe(true);
    });

    it('should expose error computed from api', () => {
      mockAPI.error.value = 'Network error';
      const shareAPI = useShareAPI();
      expect(shareAPI.error.value).toBe('Network error');
    });
  });

  describe('getPublicCV', () => {
    it('should fetch public CV without auth token', async () => {
      const backendCV = {
        _id: '1',
        personal: { name: 'John Doe' },
        shareUrl: 'public-url-abc'
      };

      mockAPI.request.mockResolvedValue({
        data: { cv: backendCV }
      });

      const shareAPI = useShareAPI();
      const result = await shareAPI.getPublicCV('public-url-abc');

      expect(mockAPI.request).toHaveBeenCalledWith('/share/public-url-abc', {
        method: 'GET',
        headers: {}
      });
      expect(shareAPI.publicCV.value).toEqual(backendCV);
      expect(result.data.cv).toEqual(backendCV);
      expect(result.data.cvFrontend._mapped).toBe('frontend');
      expect(cvMapper.mapBackendToFrontend).toHaveBeenCalledWith(backendCV);
    });

    it('should fetch public CV with auth token', async () => {
      const backendCV = {
        _id: '2',
        personal: { name: 'Jane Smith' },
        requiresAuth: true
      };

      mockAPI.request.mockResolvedValue({
        data: { cv: backendCV }
      });

      const shareAPI = useShareAPI();
      const result = await shareAPI.getPublicCV('protected-url-xyz', 'auth-token-123');

      expect(mockAPI.request).toHaveBeenCalledWith('/share/protected-url-xyz', {
        method: 'GET',
        headers: { 'X-CV-Auth': 'auth-token-123' }
      });
      expect(shareAPI.publicCV.value).toEqual(backendCV);
      expect(result.data.cv).toEqual(backendCV);
    });

    it('should return response without setting publicCV if no cv in data', async () => {
      mockAPI.request.mockResolvedValue({
        data: { message: 'CV not found' }
      });

      const shareAPI = useShareAPI();
      const result = await shareAPI.getPublicCV('invalid-url');

      expect(shareAPI.publicCV.value).toBeNull();
      expect(result.data.message).toBe('CV not found');
    });
  });

  describe('verifyPassword', () => {
    it('should verify password and return token', async () => {
      mockAPI.post.mockResolvedValue({
        data: { token: 'verified-auth-token-456' }
      });

      const shareAPI = useShareAPI();
      const token = await shareAPI.verifyPassword('protected-url', 'secret-password');

      expect(mockAPI.post).toHaveBeenCalledWith('/share/protected-url/verify', {
        password: 'secret-password'
      });
      expect(token).toBe('verified-auth-token-456');
    });

    it('should return null if no token in response', async () => {
      mockAPI.post.mockResolvedValue({
        data: { error: 'Invalid password' }
      });

      const shareAPI = useShareAPI();
      const token = await shareAPI.verifyPassword('protected-url', 'wrong-password');

      expect(token).toBeNull();
    });

    it('should return null if response data is null', async () => {
      mockAPI.post.mockResolvedValue({ data: null });

      const shareAPI = useShareAPI();
      const token = await shareAPI.verifyPassword('protected-url', 'password');

      expect(token).toBeNull();
    });
  });

  describe('downloadPublicCV', () => {
    it('should download public CV without auth token', async () => {
      const downloadData = {
        filename: 'John_Doe_CV.pdf',
        url: 'https://cdn.example.com/cv-export.pdf'
      };

      mockAPI.request.mockResolvedValue({
        data: downloadData
      });

      const shareAPI = useShareAPI();
      const result = await shareAPI.downloadPublicCV('public-url-download');

      expect(mockAPI.request).toHaveBeenCalledWith('/share/public-url-download/download', {
        method: 'GET',
        headers: {}
      });
      expect(result).toEqual(downloadData);
    });

    it('should download public CV with auth token', async () => {
      const downloadData = {
        filename: 'Protected_CV.pdf',
        contentType: 'application/pdf'
      };

      mockAPI.request.mockResolvedValue({
        data: downloadData
      });

      const shareAPI = useShareAPI();
      const result = await shareAPI.downloadPublicCV('protected-url', 'auth-token-789');

      expect(mockAPI.request).toHaveBeenCalledWith('/share/protected-url/download', {
        method: 'GET',
        headers: { 'X-CV-Auth': 'auth-token-789' }
      });
      expect(result).toEqual(downloadData);
    });

    it('should return null if no data in response', async () => {
      mockAPI.request.mockResolvedValue({ data: null });

      const shareAPI = useShareAPI();
      const result = await shareAPI.downloadPublicCV('empty-url');

      expect(result).toBeNull();
    });
  });

  describe('clearCV', () => {
    it('should clear publicCV ref', () => {
      const shareAPI = useShareAPI();
      shareAPI.publicCV.value = {
        _id: '1',
        personal: { name: 'Test' }
      };

      expect(shareAPI.publicCV.value).not.toBeNull();

      shareAPI.clearCV();

      expect(shareAPI.publicCV.value).toBeNull();
    });

    it('should handle multiple clears', () => {
      const shareAPI = useShareAPI();
      shareAPI.publicCV.value = { _id: '1' };
      
      shareAPI.clearCV();
      expect(shareAPI.publicCV.value).toBeNull();
      
      shareAPI.clearCV();
      expect(shareAPI.publicCV.value).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from getPublicCV', async () => {
      mockAPI.request.mockRejectedValue(new Error('CV not found'));

      const shareAPI = useShareAPI();
      
      await expect(shareAPI.getPublicCV('invalid-url')).rejects.toThrow('CV not found');
    });

    it('should propagate errors from verifyPassword', async () => {
      mockAPI.post.mockRejectedValue(new Error('Password verification failed'));

      const shareAPI = useShareAPI();
      
      await expect(shareAPI.verifyPassword('url', 'pass')).rejects.toThrow('Password verification failed');
    });

    it('should propagate errors from downloadPublicCV', async () => {
      mockAPI.request.mockRejectedValue(new Error('Download failed'));

      const shareAPI = useShareAPI();
      
      await expect(shareAPI.downloadPublicCV('url')).rejects.toThrow('Download failed');
    });
  });
});
