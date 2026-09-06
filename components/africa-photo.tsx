'use client';

const AFRICA_PATH =
  'M 32 2 C 45 0 60 1 72 6 C 78 9 80 14 79 19 C 88 22 96 28 97 36 C 99 44 92 47 86 44 ' +
  'C 90 52 90 61 86 68 C 91 75 90 84 84 90 C 86 98 82 105 74 108 C 68 110 63 107 62 101 ' +
  'C 58 104 52 103 49 98 C 43 100 37 96 36 90 C 30 91 24 87 23 80 C 16 79 10 74 10 66 ' +
  'C 4 62 2 54 6 47 C 1 41 2 32 9 27 C 7 20 12 13 20 10 C 20 5 26 3 32 2 Z';

interface AfricaPhotoProps {
  src: string;
  alt: string;
  className?: string;
}

export function AfricaPhoto({ src, alt, className }: AfricaPhotoProps) {
  return (
    <svg viewBox="0 0 100 110" role="img" aria-label={alt} className={className}>
      <defs>
        <clipPath id="africa-shape" clipPathUnits="userSpaceOnUse">
          <path d={AFRICA_PATH} />
        </clipPath>
      </defs>
      <image
        href={src}
        x="0"
        y="0"
        width="100"
        height="110"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#africa-shape)"
      />
    </svg>
  );
}
