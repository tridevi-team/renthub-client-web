import type { ReactNode } from 'react';

/**
 * A simple component to map over an array and render a list of items.
 * @param props.each The array to map over.
 * @param props.children The render function.
 * @param props.fallback The fallback to render when the array is empty.
 * @example
 * ```tsx
 * <For each={items} fallback={<p>No items found</p>}>
 *  {(item, index) => (
 *   <div key={index}>{item}</div>
 * )}
 * </For>
 * ```
 */

interface Props<T> {
  each: T[];
  children: (item: T, index: number) => ReactNode;
  fallback?: ReactNode;
}

function simpleMap<T>(
  props: Props<T>,
  wrap: (fn: Props<T>['children'], item: T, i: number) => ReactNode,
) {
  const list = props.each;
  const len = list.length;

  if (len) {
    const mapped = Array<ReactNode>(len);
    for (let i = 0; i < len; i += 1)
      mapped[i] = wrap(props.children, list[i], i);

    return mapped;
  }

  return props.fallback;
}

export function For<T>(props: Props<T>) {
  return simpleMap<T>(props, (fn, item, i) => fn(item, i));
}
