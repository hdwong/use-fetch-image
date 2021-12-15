/**
 * useImage hook
 * @param src image URL
 */
export function useImage(src: string): [
  /** image object */
  HTMLImageElement | undefined,

  /** download status */
  'loaded' | 'loading' | 'error',

  /** download percentage */
  number,
];
