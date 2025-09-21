import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // Enable React Fast Refresh
        fastRefresh: true,
      }),
      svgr({
        // SVG as React components
        svgrOptions: {
          exportType: 'default',
        },
        include: '**/*.svg',
      }),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          maximumFileSizeToCacheInBytes: 5000000, // 5MB
        },
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'masked-icon.svg',
        ],
        manifest: {
          name: '2anki - Notion to Anki Converter',
          short_name: '2anki',
          description: 'Free Website for Notion to Anki Conversion',
          theme_color: '#000000',
          icons: [
            {
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
    ],

    // Test configuration
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      css: true,
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['tests/**/*', 'e2e/**/*'],
    },

    // Define aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    // Development server configuration
    server: {
      port: 3000,
      host: true,
      open: true,
      proxy: {
        // Proxy API requests to backend
        '/api': {
          target: 'http://localhost:2020',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log(
                'Sending Request to the Target:',
                req.method,
                req.url
              );
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log(
                'Received Response from the Target:',
                proxyRes.statusCode,
                req.url
              );
            });
          },
        },
      },
    },

    // Build configuration
    build: {
      outDir: 'build',
      sourcemap: command === 'serve', // Source maps in dev
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            router: ['react-router-dom'],
          },
        },
      },
    },

    // CSS configuration
    css: {
      modules: {
        // CSS Modules configuration
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {
          // SCSS global imports if needed
          additionalData: ``,
        },
      },
    },

    // Environment variables configuration
    define: {
      // Keep existing REACT_APP_ variables for compatibility
      ...Object.keys(env).reduce((prev, key) => {
        if (key.startsWith('REACT_APP_')) {
          prev[`process.env.${key}`] = JSON.stringify(env[key]);
        }
        return prev;
      }, {}),
    },

    // Additional configuration
    optimizeDeps: {
      include: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux'],
    },
  };
});
