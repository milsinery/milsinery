import { useCallback, useEffect, useMemo, useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  buildHoverPool,
  pickHoverItem,
  Screenshot,
  HoverItem,
} from './pickHoverItem';
import NativeShelfBadge from '../../pages/app/NativeShelfBadge';
import './index.css';

type ApplicationProps = {
  webp: string;
  png: string;
  name: string;
  info: string;
  installLink?: string;
  infoLink?: string;
  comment?: Array<{ text: string; author: string }>;
  screenshots?: Screenshot[];
  isNewLabel: boolean;
  label?: string;
  comingSoon?: boolean;
};

const HOVER_MQ = '(hover: hover) and (pointer: fine)';

const canHoverNow = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(HOVER_MQ).matches;

const symbols = [
  '🥰',
  '👏',
  '😎',
  '🔥',
  '💔',
  '😍',
  '💪',
  '🎉',
  '🥳',
  '🍾',
  '😜',
  '😽',
  '🤟',
  '🤌',
];

const randomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const Application = ({
  webp,
  png,
  name,
  info,
  installLink,
  infoLink,
  comment,
  screenshots,
  isNewLabel,
  label,
  comingSoon,
}: ApplicationProps) => {
  const pool = useMemo(
    () => buildHoverPool(comment ?? [], screenshots ?? []),
    [comment, screenshots]
  );
  const fanShots = useMemo(() => {
    const fan = pool.find((entry) => entry.type === 'fan');
    return fan && fan.type === 'fan' ? fan.shots : [];
  }, [pool]);
  const [canHover, setCanHover] = useState(canHoverNow);
  const [item, setItem] = useState<HoverItem | null>(null);
  const [isIn, setIsIn] = useState(false);
  const [emoji, setEmoji] = useState<[string, string]>(['🎉', '✨']);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia(HOVER_MQ);
    const onChange = () => setCanHover(mql.matches);
    onChange();
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  // Warm the hover-fan images before the first mouse enter so they don't flash in.
  // Use the same WebP URLs the fan <picture> uses, and only on hover-capable pointers.
  useEffect(() => {
    if (!canHover || fanShots.length === 0) {
      return;
    }

    const links: HTMLLinkElement[] = [];
    const win = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const preload = () => {
      fanShots.forEach((shot) => {
        const href = shot.webp;
        const already = Array.from(
          document.head.querySelectorAll('link[rel="preload"][as="image"]')
        ).some((el) => el.getAttribute('href') === href);
        if (!already) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.type = 'image/webp';
          link.href = href;
          document.head.appendChild(link);
          links.push(link);
        }
        const img = new Image();
        img.src = href;
        if (typeof img.decode === 'function') {
          img.decode().catch(() => undefined);
        }
      });
    };

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(preload, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(preload, 1);
    }

    return () => {
      if (idleId !== undefined && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      links.forEach((link) => link.remove());
    };
  }, [canHover, fanShots]);

  const onMouseEnter = useCallback(() => {
    if (!canHover || pool.length === 0) {
      return;
    }
    setIsIn(false);
    setItem((current) => pickHoverItem(pool, current));
    setEmoji([randomSymbol(), randomSymbol()]);
  }, [canHover, pool]);

  const onMouseLeave = useCallback(() => {
    setIsIn(false);
  }, []);

  useEffect(() => {
    if (!item || !canHover) {
      return;
    }
    const id = window.requestAnimationFrame(() => setIsIn(true));
    return () => window.cancelAnimationFrame(id);
  }, [item, canHover, emoji]);

  const badge = label || (isNewLabel ? 'New' : '');

  return (
    <article
      className="application"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="application__shell">
      {badge && <span className="application__isNewLable t-h3">{badge}</span>}

      <div className="application__cover">
        <picture>
          <source srcSet={webp} type="image/webp" />
          <img
            loading="lazy"
            src={png}
            width="100%"
            height="100%"
            alt={`${name} icon`}
          />
        </picture>
      </div>

      <div className="application__info">
        <h3 className="application__title t-h2">{name}</h3>
        <p className="application__description">{info}</p>
        <div className="application__links">
          {comingSoon ? (
            <span className="application__link application__link--soon">
              <span className="t-h3">Soon</span>
            </span>
          ) : (
            <>
              {installLink && (
                <a
                  className="application__link"
                  href={installLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="t-h3">Install</span>
                  <span className="visually-hidden"> {name} (opens in new tab)</span>
                </a>
              )}

              {infoLink && (
                <Link to={infoLink}>
                  <span className="application__link t-h3">About</span>
                  <span className="visually-hidden"> {name}</span>
                </Link>
              )}
              {infoLink === '/apps/pulse' && <NativeShelfBadge />}
            </>
          )}
        </div>
      </div>
      </div>

      {item && (
        // Hover-only decoration: hidden from screen readers.
        <div
          className={
            'application__commentary' +
            (item.type === 'fan' ? ' application__commentary--fan' : '') +
            (isIn ? ' is-in' : '')
          }
          aria-hidden="true"
        >
          {item.type === 'review' ? (
            <>
              <div className="application__commentary-card">
                <span className="application__commentary-title t-h4">{item.text}</span>
                <small className="application__commentary-author">{item.author}</small>
              </div>
              <span className="application__commentary-sym-1 t-h2">{emoji[0]}</span>
              <span className="application__commentary-sym-2 t-h1">{emoji[1]}</span>
            </>
          ) : (
            <div
              className="application__fan"
              style={
                {
                  '--fan-count': item.shots.length,
                } as CSSProperties
              }
            >
              {item.shots.map((shot, index) => (
                <picture
                  className="application__fan-card"
                  key={shot.src}
                  style={{ '--fan-index': index } as CSSProperties}
                >
                  <source srcSet={shot.webp} type="image/webp" />
                  <img src={shot.src} alt="" width="1242" height="2688" />
                </picture>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default Application;
