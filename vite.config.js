import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React and React DOM
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // PDF libraries (heavy)
          'pdf-vendor': ['jspdf', 'html2canvas', 'jspdf-autotable'],
          // Date picker
          'date-vendor': ['react-datepicker'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase limit slightly to reduce warnings
  },
})
