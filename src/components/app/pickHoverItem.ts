export type Screenshot = {
  webp: string;
  src: string;
  alt: string;
  inFan?: boolean;
};

export type ReviewItem = {
  type: 'review';
  text: string;
  author: string;
};

export type FanItem = {
  type: 'fan';
  shots: Screenshot[];
};

export type HoverItem = ReviewItem | FanItem;

export const itemKey = (item: HoverItem): string => {
  if (item.type === 'fan') {
    return 'fan';
  }
  return `review:${item.author}:${item.text}`;
};

export const buildHoverPool = (
  comments: Array<{ text: string; author: string }> = [],
  screenshots: Screenshot[] = []
): HoverItem[] => {
  const pool: HoverItem[] = comments.map((comment) => ({
    type: 'review' as const,
    text: comment.text,
    author: comment.author,
  }));
  const fanShots = screenshots.filter((shot) => shot.inFan);
  if (fanShots.length >= 3) {
    pool.push({ type: 'fan', shots: fanShots.slice(0, 5) });
  }
  return pool;
};

/** Pick a random item, never the same one twice in a row when the pool has 2+ items. */
export const pickHoverItem = (
  pool: HoverItem[],
  current: HoverItem | null
): HoverItem | null => {
  if (pool.length === 0) {
    return null;
  }
  if (pool.length === 1) {
    return pool[0];
  }
  const currentId = current ? itemKey(current) : null;
  const options =
    currentId == null ? pool : pool.filter((item) => itemKey(item) !== currentId);
  return options[Math.floor(Math.random() * options.length)];
};
