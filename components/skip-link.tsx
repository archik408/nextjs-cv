'use client';

const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={() =>
        document
          ?.querySelector('#main-content')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
