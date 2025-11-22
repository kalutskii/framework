import { defineConfig } from 'tsup';

const tsupConfig = defineConfig({
  target: 'esnext',
  outDir: 'dist', // Output directory for compiled files
  entry: ['index.ts'], // Entry point for the application
  format: ['esm'], // Only 'esm' format is supported
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
});

export default tsupConfig;
