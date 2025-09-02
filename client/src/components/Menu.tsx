import { useState } from 'react';
import type { ReactNode } from 'react';

type MenuProps = {
  children: ReactNode;
};

function Menu({ children }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full ">
      <div className="mx-auto container px-8 bg-white/90 dark:bg-zinc-900/80 backdrop-blur border-b md:rounded-b-lg border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100">
        <div className="flex items-center justify-between py-2 sm:py-3">
          <button
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden inlin-flex items-center justify-center rounded-md p-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          <ul className="hidden md:flex items-center gap-2 sm:gap-4 list-none">{children}</ul>
        </div>

        <div
          id="mobile-menu"
          className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-zinc-200 dark:border-zinc-800`}
        >
          <ul className="flex flex-col gap-1 py-2 list-none">{children}</ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
