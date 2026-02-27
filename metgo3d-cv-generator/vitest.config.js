import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    // Entorno de prueba
    environment: 'jsdom',
    
    // Archivos de test a buscar
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Configuración de cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/main.js',
        '**/*.vue'
      ]
    },
    
    // Globals para test
    globals: true,
    
    // Timeout para tests
    testTimeout: 10000,
    
    // Setup files
    setupFiles: [],
    
    // Mock globals
    mockReset: true,
    restoreMocks: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
