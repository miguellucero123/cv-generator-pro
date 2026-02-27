import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCVAPI } from '../../composables/useCVAPI';
import * as cvMapper from '../../utils/cvMapper';

// Mock useAPI composable
const mockAPI = {
  loading: { value: false },
  error: { value: null },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn()
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
  mapBackendToFrontend: vi.fn((data) => ({ ...data, _mapped: 'frontend' })),
  mapFrontendToBackend: vi.fn((data) => ({ ...data, _mapped: 'backend' }))
}));

describe('useCVAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAPI.loading.value = false;
    mockAPI.error.value = null;
  });

  describe('Reactive state', () => {
    it('should expose cvs array', () => {
      const cvAPI = useCVAPI();
      expect(cvAPI.cvs.value).toEqual([]);
    });

    it('should expose loading computed from api', () => {
      mockAPI.loading.value = true;
      const cvAPI = useCVAPI();
      expect(cvAPI.loading.value).toBe(true);
    });

    it('should expose error computed from api', () => {
      mockAPI.error.value = 'Test error';
      const cvAPI = useCVAPI();
      expect(cvAPI.error.value).toBe('Test error');
    });
  });

  describe('getCVs', () => {
    it('should fetch CVs without parameters', async () => {
      mockAPI.get.mockResolvedValue({
        data: { cvs: [{ _id: '1', title: 'CV 1' }, { _id: '2', title: 'CV 2' }] }
      });

      const cvAPI = useCVAPI();
      const result = await cvAPI.getCVs();

      expect(mockAPI.get).toHaveBeenCalledWith('/cvs');
      expect(cvAPI.cvs.value).toHaveLength(2);
      expect(cvAPI.cvs.value[0].title).toBe('CV 1');
    });

    it('should fetch CVs with query parameters', async () => {
      mockAPI.get.mockResolvedValue({
        data: { cvs: [{ _id: '1', title: 'Published CV' }] }
      });

      const cvAPI = useCVAPI();
      await cvAPI.getCVs({ status: 'published', limit: 10 });

      expect(mockAPI.get).toHaveBeenCalledWith('/cvs?status=published&limit=10');
    });

    it('should handle empty CVs response', async () => {
      mockAPI.get.mockResolvedValue({ data: {} });
      
      const cvAPI = useCVAPI();
      await cvAPI.getCVs();

      expect(cvAPI.cvs.value).toEqual([]);
    });
  });

  describe('getCV', () => {
    it('should fetch single CV without mapping', async () => {
      mockAPI.get.mockResolvedValue({
        data: { cv: { _id: '1', title: 'Test CV', personal: { name: 'John' } } }
      });

      const cvAPI = useCVAPI();
      const result = await cvAPI.getCV('1');

      expect(mockAPI.get).toHaveBeenCalledWith('/cvs/1');
      expect(result.data.cv.title).toBe('Test CV');
      expect(cvMapper.mapBackendToFrontend).not.toHaveBeenCalled();
    });

    it('should fetch single CV with frontend mapping', async () => {
      const backendCV = { _id: '1', title: 'Test CV', personal: { name: 'John' } };
      mockAPI.get.mockResolvedValue({ data: { cv: backendCV } });

      const cvAPI = useCVAPI();
      const result = await cvAPI.getCV('1', true);

      expect(mockAPI.get).toHaveBeenCalledWith('/cvs/1');
      expect(cvMapper.mapBackendToFrontend).toHaveBeenCalledWith(backendCV);
      expect(result.data.cv._mapped).toBe('frontend');
      expect(result.data.raw).toEqual(backendCV);
    });
  });

  describe('createCV', () => {
    it('should create CV with frontend format (default)', async () => {
      const frontendCV = { personalInfo: { name: 'Jane' }, experience: [] };
      mockAPI.post.mockResolvedValue({
        data: { cv: { _id: '3', personal: { name: 'Jane' } } }
      });

      const cvAPI = useCVAPI();
      await cvAPI.createCV(frontendCV);

      expect(cvMapper.mapFrontendToBackend).toHaveBeenCalledWith(frontendCV);
      expect(mockAPI.post).toHaveBeenCalledWith('/cvs', expect.objectContaining({ _mapped: 'backend' }));
    });

    it('should create CV without mapping when specified', async () => {
      const backendCV = { personal: { name: 'Jane' }, experience: [] };
      mockAPI.post.mockResolvedValue({
        data: { cv: { _id: '3', ...backendCV } }
      });

      const cvAPI = useCVAPI();
      await cvAPI.createCV(backendCV, false);

      expect(cvMapper.mapFrontendToBackend).not.toHaveBeenCalled();
      expect(mockAPI.post).toHaveBeenCalledWith('/cvs', backendCV);
    });
  });

  describe('updateCV', () => {
    it('should update CV with frontend format (default)', async () => {
      const frontendCV = { personalInfo: { name: 'Updated' } };
      mockAPI.put.mockResolvedValue({
        data: { cv: { _id: '1', personal: { name: 'Updated' } } }
      });

      const cvAPI = useCVAPI();
      await cvAPI.updateCV('1', frontendCV);

      expect(cvMapper.mapFrontendToBackend).toHaveBeenCalledWith(frontendCV);
      expect(mockAPI.put).toHaveBeenCalledWith('/cvs/1', expect.objectContaining({ _mapped: 'backend' }));
    });

    it('should update CV without mapping when specified', async () => {
      const backendCV = { personal: { name: 'Updated' } };
      mockAPI.put.mockResolvedValue({
        data: { cv: { _id: '1', ...backendCV } }
      });

      const cvAPI = useCVAPI();
      await cvAPI.updateCV('1', backendCV, false);

      expect(cvMapper.mapFrontendToBackend).not.toHaveBeenCalled();
      expect(mockAPI.put).toHaveBeenCalledWith('/cvs/1', backendCV);
    });
  });

  describe('deleteCV', () => {
    it('should delete CV and remove from cvs array', async () => {
      mockAPI.del.mockResolvedValue({ success: true });

      const cvAPI = useCVAPI();
      cvAPI.cvs.value = [
        { _id: '1', title: 'CV 1' },
        { _id: '2', title: 'CV 2' },
        { _id: '3', title: 'CV 3' }
      ];

      await cvAPI.deleteCV('2');

      expect(mockAPI.del).toHaveBeenCalledWith('/cvs/2');
      expect(cvAPI.cvs.value).toHaveLength(2);
      expect(cvAPI.cvs.value.find(c => c._id === '2')).toBeUndefined();
      expect(cvAPI.cvs.value.find(c => c._id === '1')).toBeDefined();
    });
  });

  describe('cloneCV', () => {
    it('should clone CV and add to beginning of cvs array', async () => {
      const clonedCV = { _id: '4', title: 'CV 1 (Copy)' };
      mockAPI.post.mockResolvedValue({ data: { cv: clonedCV } });

      const cvAPI = useCVAPI();
      cvAPI.cvs.value = [
        { _id: '1', title: 'CV 1' },
        { _id: '2', title: 'CV 2' }
      ];

      await cvAPI.cloneCV('1');

      expect(mockAPI.post).toHaveBeenCalledWith('/cvs/1/clone');
      expect(cvAPI.cvs.value).toHaveLength(3);
      expect(cvAPI.cvs.value[0]._id).toBe('4');
      expect(cvAPI.cvs.value[0].title).toBe('CV 1 (Copy)');
    });

    it('should handle clone with no cv in response', async () => {
      mockAPI.post.mockResolvedValue({ data: {} });

      const cvAPI = useCVAPI();
      cvAPI.cvs.value = [{ _id: '1', title: 'CV 1' }];

      await cvAPI.cloneCV('1');

      expect(cvAPI.cvs.value).toHaveLength(1);
    });
  });

  describe('exportCV', () => {
    it('should export CV without mapping', async () => {
      const cvData = { _id: '1', personal: { name: 'Export Test' } };
      mockAPI.get.mockResolvedValue({ data: cvData });

      const cvAPI = useCVAPI();
      const result = await cvAPI.exportCV('1');

      expect(mockAPI.get).toHaveBeenCalledWith('/cvs/1/export');
      expect(cvMapper.mapBackendToFrontend).not.toHaveBeenCalled();
      expect(result.data).toEqual(cvData);
    });

    it('should export CV with frontend mapping', async () => {
      const cvData = { _id: '1', personal: { name: 'Export Test' } };
      mockAPI.get.mockResolvedValue({ data: cvData });

      const cvAPI = useCVAPI();
      const result = await cvAPI.exportCV('1', true);

      expect(mockAPI.get).toHaveBeenCalledWith('/cvs/1/export');
      expect(cvMapper.mapBackendToFrontend).toHaveBeenCalledWith(cvData);
      expect(result.data._mapped).toBe('frontend');
    });
  });

  describe('importCV', () => {
    it('should import CV with personal field', async () => {
      const cvData = { personal: { name: 'Import Test' }, experience: [] };
      mockAPI.post.mockResolvedValue({
        data: { cv: { _id: '5', ...cvData } }
      });

      const cvAPI = useCVAPI();
      await cvAPI.importCV(cvData);

      expect(mockAPI.post).toHaveBeenCalledWith('/cvs/import', cvData);
    });

    it('should import CV with personalInfo field and wrap it', async () => {
      const cvData = { personalInfo: { name: 'Import Test' }, experience: [] };
      mockAPI.post.mockResolvedValue({
        data: { cv: { _id: '5', personal: cvData.personalInfo } }
      });

      const cvAPI = useCVAPI();
      await cvAPI.importCV(cvData);

      // importCV pasará cvData tal cual porque tiene personalInfo
      expect(mockAPI.post).toHaveBeenCalledWith('/cvs/import', cvData);
    });

    it('should import CV without standard fields', async () => {
      const cvData = { customField: 'value', anotherField: 123 };
      mockAPI.post.mockResolvedValue({
        data: { cv: { _id: '5' } }
      });

      const cvAPI = useCVAPI();
      await cvAPI.importCV(cvData);

      expect(mockAPI.post).toHaveBeenCalledWith('/cvs/import', expect.objectContaining({
        personal: cvData
      }));
    });
  });

  describe('Share settings', () => {
    it('should get share settings', async () => {
      mockAPI.get.mockResolvedValue({
        data: { isPublic: true, shareUrl: 'https://example.com/cv/abc123' }
      });

      const cvAPI = useCVAPI();
      const result = await cvAPI.getShareSettings('1');

      expect(mockAPI.get).toHaveBeenCalledWith('/cvs/1/share');
      expect(result.data.isPublic).toBe(true);
    });

    it('should update share settings', async () => {
      mockAPI.put.mockResolvedValue({
        data: { isPublic: false, requirePassword: true }
      });

      const cvAPI = useCVAPI();
      const settings = { isPublic: false, requirePassword: true, password: 'secret' };
      await cvAPI.updateShareSettings('1', settings);

      expect(mockAPI.put).toHaveBeenCalledWith('/cvs/1/share', settings);
    });

    it('should regenerate share URL', async () => {
      mockAPI.post.mockResolvedValue({
        data: { shareUrl: 'https://example.com/cv/new-token-456' }
      });

      const cvAPI = useCVAPI();
      const result = await cvAPI.regenerateShareUrl('1');

      expect(mockAPI.post).toHaveBeenCalledWith('/cvs/1/share/regenerate-url');
      expect(result.data.shareUrl).toContain('new-token-456');
    });
  });

  describe('Exposed utilities', () => {
    it('should expose mapBackendToFrontend function', () => {
      const cvAPI = useCVAPI();
      expect(cvAPI.mapBackendToFrontend).toBeDefined();
      expect(typeof cvAPI.mapBackendToFrontend).toBe('function');
    });

    it('should expose mapFrontendToBackend function', () => {
      const cvAPI = useCVAPI();
      expect(cvAPI.mapFrontendToBackend).toBeDefined();
      expect(typeof cvAPI.mapFrontendToBackend).toBe('function');
    });
  });
});
