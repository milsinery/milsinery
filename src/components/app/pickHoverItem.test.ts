import { buildHoverPool, itemKey, pickHoverItem } from './pickHoverItem';

const comments = [
  { author: 'Ada', text: 'Lovely' },
  { author: 'Bob', text: 'Great' },
];

const shots = [
  { webp: 'a.webp', src: 'a.jpg', alt: 'A', inFan: true },
  { webp: 'b.webp', src: 'b.jpg', alt: 'B', inFan: true },
  { webp: 'c.webp', src: 'c.jpg', alt: 'C', inFan: true },
  { webp: 'd.webp', src: 'd.jpg', alt: 'D' },
];

test('buildHoverPool adds reviews and a fan of up to five inFan shots', () => {
  const pool = buildHoverPool(comments, shots);
  expect(pool).toHaveLength(3);
  expect(pool.filter((item) => item.type === 'review')).toHaveLength(2);
  const fan = pool.find((item) => item.type === 'fan');
  expect(fan && fan.type === 'fan' && fan.shots.map((s) => s.alt)).toEqual([
    'A',
    'B',
    'C',
  ]);
});

test('buildHoverPool omits the fan when there are fewer than three fan shots', () => {
  expect(buildHoverPool(comments, shots.slice(0, 2))).toHaveLength(2);
  expect(buildHoverPool(comments)).toHaveLength(2);
});

test('pickHoverItem never repeats the same item twice in a row', () => {
  const pool = buildHoverPool(comments, shots);
  const seen = new Set<string>();
  let current = pickHoverItem(pool, null);
  expect(current).not.toBeNull();
  for (let i = 0; i < 40; i += 1) {
    const next = pickHoverItem(pool, current);
    expect(next).not.toBeNull();
    expect(itemKey(next!)).not.toBe(itemKey(current!));
    seen.add(itemKey(next!));
    current = next;
  }
  expect(seen.size).toBe(pool.length);
});

test('pickHoverItem returns the only item when the pool has one entry', () => {
  const pool = buildHoverPool([comments[0]]);
  const first = pickHoverItem(pool, null);
  expect(first && itemKey(first)).toBe(itemKey(pool[0]));
  expect(itemKey(pickHoverItem(pool, first)!)).toBe(itemKey(pool[0]));
});

test('pickHoverItem returns null for an empty pool', () => {
  expect(pickHoverItem([], null)).toBeNull();
});
