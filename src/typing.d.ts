
export { };

export type Color = { r: number, g: number, b: number, a?: number };

declare global {
  interface Window { getPopupMessage: (v: Color) => void };
}
