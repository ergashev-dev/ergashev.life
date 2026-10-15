import { useEffect } from 'react';

const DEFAULT_TITLE = 'Abdurashid Ergashev — Fullstack TypeScript Developer';
const DEFAULT_DESCRIPTION = 'Abdurashid Ergashev is a fullstack TypeScript developer from Uzbekistan building refined web products with React, Next.js, NestJS and Node.js.';
const SITE_URL = 'https://www.ergashev.life';

/**
 * Custom hook for dynamically updating HTML metadata and OpenGraph / Twitter tags
 */
export default function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/abdurashid-ergashev.jpg',
  type = 'website',
  url,
  robots = 'index, follow, max-image-preview:large',
} = {}) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title
      ? (title.includes('Abdurashid Ergashev') ? title : `${title} — Abdurashid Ergashev`)
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const cleanPath = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/+$/, '');
    const currentUrl = url
      ? new URL(url, SITE_URL).href
      : `${SITE_URL}${cleanPath}`;

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', robots);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl.split('#')[0]);

    // 3. OpenGraph Meta Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', currentUrl);
    if (image) {
      const fullImageUrl = image.startsWith('http')
        ? image
        : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
      setMetaTag('property', 'og:image', fullImageUrl);
    }

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    if (image) {
      const fullImageUrl = image.startsWith('http')
        ? image
        : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
      setMetaTag('name', 'twitter:image', fullImageUrl);
    }
  }, [title, description, image, type, url, robots]);
}
