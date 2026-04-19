import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SEO({ 
  title = "Primbon Jawa Modern - Weton, Ramalan & Sesepuh AI", 
  description = "Aplikasi Primbon Jawa Modern paling akurat. Cek Weton, Ramalan Nasib, Kecocokan Jodoh, dan Konsultasi dengan Sesepuh AI secara interaktif.",
  keywords = "primbon jawa, cek weton, ramalan jodoh, kalender jawa, penanggalan jawa, sesepuh ai, bot primbon"
}: SEOProps) {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Update OG Tags
    const updateOG = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateOG('og:title', title);
    updateOG('og:description', description);
    updateOG('og:type', 'website');
    updateOG('og:image', '/og-image.png');

    // Update Twitter Tags
    const updateTwitter = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateTwitter('twitter:card', 'summary_large_image');
    updateTwitter('twitter:title', title);
    updateTwitter('twitter:description', description);
    updateTwitter('twitter:image', '/og-image.png');

  }, [title, description, keywords]);

  return null;
}
