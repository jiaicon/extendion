
export { };

declare module '*.module.less' {
  const classes: {
    readonly [key: string]: string
  }
  export default classes
  declare module '*.less'
}

export type Color = { r: number, g: number, b: number, a?: number };

declare global {
  interface Window { getPopupMessage: (v: Color) => void };
}
