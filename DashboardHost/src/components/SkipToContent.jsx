import React from 'react';

// PUBLIC_INTERFACE
function SkipToContent() {
  /** Accessible skip to content link, improves keyboard navigation. */
  return (
    <a href="#main-content" className="skip-to-content">
      Skip to content
    </a>
  );
}

export default SkipToContent;
