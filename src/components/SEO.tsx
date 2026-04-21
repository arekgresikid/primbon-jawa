import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SEO({ 
  title = "Primbon Jawa Modern | Cek Weton, Lacak Barang Hilang & Katuranggan AI", 
  description = "Aplikasi Primbon Jawa lengkap dengan fitur hitung weton, pelacakan barang hilang, ensiklopedia katuranggan manusia & perkutut, serta asisten AI Sesepuh.",
  keywords = "primbon jawa, cek weton online, ramalan jodoh, kalender jawa 2026, cara mencari barang hilang menurut primbon, hitungan neptu barang hilang, katuranggan manusia, katuranggan perkutut pembawa rejeki, ciri mati perkutut, primbon watak, asisten ai primbon, ramalan nasib weton"
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

    const BASE_URL = 'https://jawidigital.my.id';

    updateOG('og:title', title);
    updateOG('og:description', description);
    updateOG('og:type', 'website');
    updateOG('og:image', `${BASE_URL}/og-image.png`);

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
    updateTwitter('twitter:image', `${BASE_URL}/og-image.png`);

  }, [title, description, keywords]);

  return null;
}
