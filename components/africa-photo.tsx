'use client';

import { AFRICA_PATH, AFRICA_VIEWBOX_W as VIEWBOX_W, AFRICA_VIEWBOX_H as VIEWBOX_H } from '@/components/africa-shape';

interface AfricaPhotoProps {
  src: string;
  alt: string;
  className?: string;
  /** Actual pixel width/height of the source photo — required to crop it correctly. */
  srcWidth: number;
  srcHeight: number;
  /** >1 crops in tighter on the source photo; use to reduce empty space landing in the shape's narrow areas. */
  zoom?: number;
}

export function AfricaPhoto({ src, alt, className, srcWidth, srcHeight, zoom = 1.15 }: AfricaPhotoProps) {
  const srcAspect = srcWidth / srcHeight;
  const coverScale = Math.max(VIEWBOX_W / (srcAspect * VIEWBOX_H), 1) * zoom;
  const imgH = VIEWBOX_H * coverScale;
  const imgW = imgH * srcAspect;
  const x = (VIEWBOX_W - imgW) / 2;
  const y = (VIEWBOX_H - imgH) / 2;

  return (
    <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} role="img" aria-label={alt} className={className}>
      <defs>
        <clipPath id="africa-shape" clipPathUnits="userSpaceOnUse">
          <path d={AFRICA_PATH} />
        </clipPath>
      </defs>
      <image href={src} x={x} y={y} width={imgW} height={imgH} clipPath="url(#africa-shape)" />
    </svg>
  );
}
