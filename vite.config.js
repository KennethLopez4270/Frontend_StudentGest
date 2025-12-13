// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },

  // ✅ CONFIGURACIÓN DE PRODUCCIÓN - Mitigación de vulnerabilidades ZAP
  build: {
    // Eliminar comentarios en producción
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true
      },
      format: {
        comments: false
      }
    },
    // ✅ Deshabilitar source maps en producción
    sourcemap: mode !== 'production',

    // ✅ IMPORTANTE: Evitar scripts inline para cumplir CSP estricta
    cssCodeSplit: true,

    rollupOptions: {
      output: {
        // Asegurar que no haya código inline
        inlineDynamicImports: false,
        manualChunks: {
          vendor: ['vue', 'vue-router']
        }
      }
    }
  },

  // ✅ Configuración CSS para evitar inline styles
  css: {
    devSourcemap: mode !== 'production'
  },

  // Solo para desarrollo local
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));