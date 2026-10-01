import { format, formatDistanceToNowStrict, type Locale } from 'date-fns';
import { fr } from 'date-fns/locale';

const locale: Locale = fr;

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'd MMM yyyy', { locale });
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNowStrict(new Date(date), { locale, addSuffix: true });
}

/** « 30/09 à 14:32 » — horodatage compact utilisé par les cartes et les fils. */
export function editorialTimestamp(date: Date | string): string {
  return format(new Date(date), 'dd/MM à HH:mm', { locale });
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('fr-SN', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min`;
}

/** « 42:15 » — durée d'un média (podcast, vidéo). */
export function formatClock(seconds: number | null | undefined): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatCurrency(amount: number, currency = 'XOF'): string {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
