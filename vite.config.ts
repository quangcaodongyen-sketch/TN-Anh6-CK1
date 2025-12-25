
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite không tự động đưa process.env vào trình duyệt. 
    // Dòng này giúp 'process.env.API_KEY' trong code của bạn lấy được giá trị từ Vercel.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});
