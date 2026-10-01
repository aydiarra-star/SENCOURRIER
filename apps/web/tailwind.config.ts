import type { Config } from 'tailwindcss';
import preset from '../../packages/config/tailwind-preset.js';

const config: Config = {
  presets: [preset as Config],
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/lib/**/*.{ts,tsx}',
    './src/content/**/*.{md,mdx}',
  ],
};

export default config;
