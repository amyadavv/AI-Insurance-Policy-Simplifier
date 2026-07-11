import { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({
  children,
  className = '',
  animation = 'fade-up', // fade-in, fade-up, fade-down, slide-left, slide-right
  delay = 0, // in ms
  duration = 800, // in ms
  threshold = 0.05,
  once = true,
}) => {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);

  const getAnimationStyles = () => {
    const base = {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${duration}ms`,
      transitionDelay: `${delay}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Smooth easeOutExpo curves
      willChange: 'opacity, transform',
    };

    if (isRevealed) {
      return {
        ...base,
        opacity: 1,
        transform: 'translate(0, 0) scale(1)',
      };
    }

    switch (animation) {
      case 'fade-up':
        return {
          ...base,
          opacity: 0,
          transform: 'translateY(30px)',
        };
      case 'fade-down':
        return {
          ...base,
          opacity: 0,
          transform: 'translateY(-30px)',
        };
      case 'slide-left':
        return {
          ...base,
          opacity: 0,
          transform: 'translateX(30px)',
        };
      case 'slide-right':
        return {
          ...base,
          opacity: 0,
          transform: 'translateX(-30px)',
        };
      case 'fade-in':
      default:
        return {
          ...base,
          opacity: 0,
        };
    }
  };

  return (
    <div ref={ref} className={className} style={getAnimationStyles()}>
      {children}
    </div>
  );
};

export default ScrollReveal;
