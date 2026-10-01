import type { Config } from 'tailwindcss';
import preset from '../../packages/config/tailwind-preset.js';

const config: Config = {
  presets: [preset as Config],
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/lib/**/*.{ts,tsx}'],
};

export default config;
