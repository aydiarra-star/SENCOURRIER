import { format, formatDistanceToNowStrict, type Locale } from 'date-fns';
import { fr } from 'date-fns/locale';

const locale: Locale = fr;

/** « 30 septembre 2026 à 18:50 » */
export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "d MMMM yyyy 'à' HH:mm", { locale });
}

/** « 30 septembre 2026 » */
export function formatDate(date: Date | string): string {
  return format(new Date(date), 'd MMMM yyyy', { locale });
}

/** « 30 sept. 2026 » — format compact pour les cartes denses. */
export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'd MMM yyyy', { locale });
}

/** « il y a 3 heures » */
export function timeAgo(date: Date | string): string {
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true, locale });
}

/**
 * Horodatage relatif adapté à l'actualité : on veut « il y a 12 min » dans
 * l'heure, « 14:32 » le jour même, puis une date courte.
 */
export function editorialTimestamp(date: Date | string): string {
  const target = new Date(date);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - target.getTime()) / 60_000);

  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;

  const sameDay =
    target.getDate() === now.getDate() &&
    target.getMonth() === now.getMonth() &&
    target.getFullYear() === now.getFullYear();

  if (sameDay) return `aujourd'hui à ${format(target, 'HH:mm')}`;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    target.getDate() === yesterday.getDate() &&
    target.getMonth() === yesterday.getMonth() &&
    target.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `hier à ${format(target, 'HH:mm')}`;

  return formatDateShort(target);
}

/** « 2 500 FCFA » — le franc CFA n'a pas de décimales. */
export function formatCurrency(amount: number, currency = 'XOF'): string {
  return `${new Intl.NumberFormat('fr-SN', { maximumFractionDigits: 0 }).format(amount)} ${currency === 'XOF' ? 'FCFA' : currency}`;
}

/** « 18 420 » avec séparateurs français. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-SN').format(value);
}

/** « 1,2 M » / « 18,4 k » pour les compteurs de vues. */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace('.', ',')} M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace('.', ',')} k`;
  return String(value);
}

/** « 28 min » à partir d'un nombre de secondes. */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes < 60) return `${minutes} min ${String(remaining).padStart(2, '0')} s`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${String(minutes % 60).padStart(2, '0')}`;
}

/** Durée lisible pour un lecteur audio : « 28:14 ». */
export function formatClock(seconds: number | null | undefined): string {
  if (seconds == null) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, '0')}`;
}

/** Crée un slug URL-safe à partir d'un titre accentué. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Initiales pour les avatars de repli. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Tronque proprement sur un mot entier. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}
