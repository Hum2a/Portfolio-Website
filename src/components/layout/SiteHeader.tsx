import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  AnimatePresence,
} from 'framer-motion';
import { Menu } from 'lucide-react';
import Monogram from '@/components/brand/Monogram';
import { CutoutAction } from '@/components/ui/CutoutAction';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { prefetchProjects } from '@/utils/prefetchRoute';
import { trackEvent } from '@/services/analyticsService';
import './SiteHeader.css';

const NAV_ITEMS = [
  { id: 'work', label: 'Work', href: '/projects', sectionId: 'work' },
  { id: 'about', label: 'About', href: '/about', sectionId: null },
  { id: 'career', label: 'Career', href: '/career', sectionId: 'career' },
  { id: 'github', label: 'GitHub', href: '/github', sectionId: 'github' },
  { id: 'contact', label: 'Contact', href: '/contact', sectionId: null },
] as const;

const STATIC_ROUTES = new Set([
  '/',
  '/projects',
  '/about',
  '/career',
  '/linkedin',
  '/github',
  '/contact',
  '/humza-login',
  '/traffic',
]);

function routeActiveId(pathname: string): string | null {
  if (pathname === '/projects') return 'work';
  if (pathname === '/about') return 'about';
  if (pathname === '/career' || pathname === '/linkedin') return 'career';
  if (pathname === '/github') return 'github';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/') return null;
  // Project detail pages (and breathapplyser-v2, etc.)
  if (!STATIC_ROUTES.has(pathname)) return 'work';
  return null;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

const SiteHeader: React.FC = () => {
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [spyId, setSpyId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const lastScrollY = useRef(0);

  const { scrollY } = useScroll();

  // Glass / scale past 80px via IntersectionObserver sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setCompact(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hide on scroll down past 400px; show immediately on scroll up
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (reducedMotion) {
      setHidden(false);
      return;
    }
    const prev = lastScrollY.current;
    lastScrollY.current = y;
    if (y < 400) {
      setHidden(false);
      return;
    }
    if (y > prev + 2) setHidden(true);
    else if (y < prev - 2) setHidden(false);
  });

  // Homepage scroll-spy
  useEffect(() => {
    if (location.pathname !== '/') {
      setSpyId(null);
      return;
    }
    const sectionIds = ['work', 'career', 'github'] as const;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let best: string | null = null;
        let bestRatio = 0.15;
        for (const id of sectionIds) {
          const r = ratios.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        setSpyId(best);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7], rootMargin: '-20% 0px -40% 0px' }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [location.pathname]);

  const routeId = routeActiveId(location.pathname);
  const activeId =
    location.pathname === '/' ? spyId ?? routeId : routeId;

  const handleCvClick = () => {
    trackEvent('engagement', 'cv_download', location.pathname);
  };

  const closeSheet = () => setSheetOpen(false);

  return (
    <>
      <div
        ref={sentinelRef}
        className="site-header-sentinel"
        aria-hidden="true"
      />
      <motion.header
        className={cn(
          'site-header',
          compact && 'site-header--compact',
          !compact && 'site-header--top'
        )}
        initial={false}
        animate={{
          y: hidden ? '-120%' : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
        }
      >
        <div
          className={cn(
            'site-header-pill',
            compact ? 'surface-3 site-header-pill--glass' : 'site-header-pill--clear'
          )}
        >
          <Link
            to="/"
            className="site-header-logo"
            aria-label="Humza Butt — Home"
          >
            <Monogram size={28} animated />
          </Link>

          <nav className="site-header-nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    'site-header-link',
                    isActive && 'site-header-link--active'
                  )}
                  onMouseEnter={
                    item.id === 'work' ? prefetchProjects : undefined
                  }
                  onFocus={item.id === 'work' ? prefetchProjects : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="site-header-active-pill"
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 30 }
                      }
                    />
                  )}
                  <span className="site-header-link-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="site-header-actions">
            <a
              href="/Humza-Butt-CV.pdf?v=2026-08"
              className="site-header-cv"
              download
              onClick={handleCvClick}
            >
              CV
            </a>
            <CutoutAction to="/contact" size="sm" className="site-header-cta">
              Get in touch
            </CutoutAction>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="site-header-menu-btn"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="site-header-sheet w-full border-glass sm:max-w-sm"
              >
                <SheetHeader>
                  <SheetTitle className="font-display text-left text-text-primary">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav
                  className="site-header-sheet-nav"
                  aria-label="Mobile primary"
                >
                  <AnimatePresence>
                    {NAV_ITEMS.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={
                          reducedMotion ? false : { opacity: 0, x: 16 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : {
                                delay: 0.04 * i,
                                duration: 0.28,
                                ease: [0.16, 1, 0.3, 1],
                              }
                        }
                      >
                        <SheetClose asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              'site-header-sheet-link',
                              activeId === item.id &&
                                'site-header-sheet-link--active'
                            )}
                            onClick={closeSheet}
                            onMouseEnter={
                              item.id === 'work' ? prefetchProjects : undefined
                            }
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </nav>
                <div className="site-header-sheet-actions">
                  <SheetClose asChild>
                    <CutoutAction to="/contact" size="sm" block>
                      Get in touch
                    </CutoutAction>
                  </SheetClose>
                  <a
                    href="/Humza-Butt-CV.pdf?v=2026-08"
                    className="site-header-sheet-cv"
                    download
                    onClick={handleCvClick}
                  >
                    Download CV
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default SiteHeader;
