'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

/**
 * Bascule clair/sombre persistée dans localStorage.
 * Le thème initial est posé par le script inline du layout racine ; ce composant
 * ne fait que lire et modifier l'état déjà appliqué au document.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('sencourrier-theme', next);
    } catch {
      // Navigation privée : le thème reste appliqué pour la session en cours.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
      aria-label={
        mounted && theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'
      }
    >
      {mounted && theme === 'dark' ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
