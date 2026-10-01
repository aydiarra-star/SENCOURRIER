import { VideoSection } from '@/components/home/video-section';
import { media } from '@/lib/data';

export const metadata = { title: 'Vidéos' };

export default function VideosPage() {
  return (
    <div className="pb-8">
      <div className="mx-auto max-w-screen-2xl px-4 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Vidéos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
          Reportages, interviews et formats courts produits par SENCOURRIER.
        </p>
      </div>
      <VideoSection videos={media.videos} />
    </div>
  );
}
