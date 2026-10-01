import { PodcastSection } from '@/components/home/podcast-section';
import { media } from '@/lib/data';

export const metadata = { title: 'Podcasts' };

export default function PodcastsPage() {
  return (
    <div className="pb-8">
      <div className="mx-auto max-w-screen-2xl px-4 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Podcasts
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
          Les émissions de la rédaction : entretiens, décryptages et grands reportages, en
          intégralité.
        </p>
      </div>
      <PodcastSection shows={media.podcasts} />
    </div>
  );
}
