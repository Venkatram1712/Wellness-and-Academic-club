import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * HeroCarousel
 * - Simple, dependency-free image carousel with autoplay (Amazon-style hero banner)
 * - Keyboard accessible, pause on hover, arrows + indicators
 *
 * Props:
 * - items: Array<{ src: string, alt?: string, href?: string }>
 * - interval?: number (ms, default 4500)
 * - transitionMs?: number (ms, default 500)
 * - showArrows?: boolean (default true)
 * - showIndicators?: boolean (default true)
 * - height?: number|string (default 320)
 */
const HeroCarousel = ({
  items = [],
  interval = 4500,
  transitionMs = 500,
  showArrows = true,
  showIndicators = true,
  height = 320,
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const max = items.length;
  const timerRef = useRef(null);

  const go = React.useCallback((next) => {
    if (max === 0) return;
    setIndex((i) => (i + next + max) % max);
  }, [max]);

  // Autoplay
  useEffect(() => {
    if (max <= 1 || paused) return undefined;
    timerRef.current = setInterval(() => go(1), interval);
    return () => clearInterval(timerRef.current);
  }, [go, interval, max, paused]);

  // Keyboard navigation
  const keyHandlers = useMemo(
    () => ({
      ArrowLeft: () => go(-1),
      ArrowRight: () => go(1),
    }),
    [go]
  );

  const onKeyDown = (e) => {
    const fn = keyHandlers[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  if (max === 0) return null;

  return (
    <Box
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotions"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2, height }}
    >
      {/* Slides */}
      <Box sx={{ position: 'relative', height: '100%' }}>
        {items.map((item, i) => (
          <Box
            key={i}
            component={item.href ? 'a' : 'div'}
            href={item.href}
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${item.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: `opacity ${transitionMs}ms ease`,
              opacity: i === index ? 1 : 0,
              pointerEvents: i === index ? 'auto' : 'none',
            }}
            aria-hidden={i === index ? 'false' : 'true'}
          >
            {/* decorative alt text via aria-label when using background */}
            <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }} aria-label={item.alt || `slide ${i + 1}`} />
          </Box>
        ))}
      </Box>

      {/* Arrows */}
      {showArrows && max > 1 && (
        <>
          <IconButton
            aria-label="Previous slide"
            onClick={() => go(-1)}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 8,
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.4)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            aria-label="Next slide"
            onClick={() => go(1)}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0,0,0,0.4)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      {/* Indicators */}
      {showIndicators && max > 1 && (
        <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 1 }}>
          {items.map((_, i) => (
            <Box
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              role="button"
              tabIndex={0}
              onClick={() => setIndex(i)}
              onKeyDown={(e) => e.key === 'Enter' && setIndex(i)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: i === index ? 'primary.main' : 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(0,0,0,0.2)',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HeroCarousel;
