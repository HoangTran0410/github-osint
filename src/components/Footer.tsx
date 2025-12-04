import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center p-6 border-t border-solid border-slate-200 dark:border-white/10 mt-auto">
      <p className="text-sm text-slate-500 dark:text-white/40">
        © 2024 GitHub OSINT. Data collected from public GitHub APIs.
      </p>
      <a
        className="text-sm text-primary/80 hover:text-primary transition-colors mt-2 inline-block"
        href="https://github.com/hoangtran0410/github-osint"
      >
        View source on GitHub
      </a>
    </footer>
  );
};

export default Footer;
