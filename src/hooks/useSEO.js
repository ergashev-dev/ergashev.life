import { useEffect } from 'react';

const DEFAULT_TITLE = "Abdurashid Ergashev's Blog";
const DEFAULT_DESCRIPTION =
  'I am Abdurashid Ergashev, a Fullstack Software Engineer from Uzbekistan with experience in PJavaScript, TypeScript, HTML, CSS, HTML5, CSS3, Bootstrap, TailwindCSS, Git, GitHub, Laravel, React.js,';

/**
 * Custom hook for dynamically updating HTML metadata and OpenGraph / Twitter tags
 */
export default function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/ergashev.png',
  type = 'website',
  url,
} = {}) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title ? `${title} - Abdurashid Ergashev` : DEFAULT_TITLE;
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

    const currentUrl = url || window.location.href;

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);

    // 3. OpenGraph Meta Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:url', currentUrl);
    if (image) {
      const fullImageUrl = image.startsWith('http')
        ? image
        : `${window.location.origin}${image.startsWith('/') ? '' : '/'}${image}`;
      setMetaTag('property', 'og:image', fullImageUrl);
    }

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    if (image) {
      const fullImageUrl = image.startsWith('http')
        ? image
        : `${window.location.origin}${image.startsWith('/') ? '' : '/'}${image}`;
      setMetaTag('name', 'twitter:image', fullImageUrl);
    }
  }, [title, description, image, type, url]);
}
