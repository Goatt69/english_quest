'use client'; // Chỉ cần thiết cho App Router

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface AdBannerProps {
  'data-ad-slot': string;
  'data-ad-format'?: string;
  'data-full-width-responsive'?: string;
  style?: React.CSSProperties;
}

const AdBanner: React.FC<AdBannerProps> = (props) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...props.style }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
      {...props}
    ></ins>
  );
};

export default AdBanner;