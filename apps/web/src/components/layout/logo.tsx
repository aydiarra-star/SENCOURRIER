/**
 * Logo SENCOURRIER.
 *
 * Le « N » du mot est remplacé par une barre tricolore : la marque reste
 * lisible en une seule couleur tout en portant les couleurs nationales.
 */
export function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline leading-none ${className}`}>
      <svg viewBox="0 0 300 44" className="h-full w-auto" role="img" aria-label="SENCOURRIER">
        <defs>
          <linearGradient id="sc-flag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00853F" />
            <stop offset="50%" stopColor="#FCD116" />
            <stop offset="100%" stopColor="#E31B23" />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="34"
          fontFamily="var(--font-montserrat), system-ui, sans-serif"
          fontSize="34"
          fontWeight="900"
          letterSpacing="-1.2"
          className="fill-neutral-900 dark:fill-white"
        >
          SEN
        </text>
        {/* Barre tricolore tenant lieu de « C », alignée sur la hauteur des capitales. */}
        <rect x="88" y="6" width="9" height="30" rx="2" fill="url(#sc-flag)" />
        <text
          x="103"
          y="34"
          fontFamily="var(--font-montserrat), system-ui, sans-serif"
          fontSize="34"
          fontWeight="900"
          letterSpacing="-1.2"
          className="fill-neutral-900 dark:fill-white"
        >
          URRIER
        </text>
      </svg>
    </span>
  );
}

/** Version compacte : monogramme pour les favicons et les avatars. */
export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="SENCOURRIER">
      <rect width="48" height="48" rx="10" fill="#00853F" />
      <rect x="14" y="10" width="5" height="28" rx="2" fill="#FCD116" />
      <text
        x="24"
        y="34"
        fontFamily="var(--font-montserrat), system-ui, sans-serif"
        fontSize="24"
        fontWeight="900"
        fill="#FFFFFF"
      >
        S
      </text>
    </svg>
  );
}
