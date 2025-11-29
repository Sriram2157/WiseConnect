declare module 'flubber' {
  export function interpolate(fromPath: string, toPath: string, options?: any): (t: number) => string;
  export function toPathString(path: any[]): string;
  export function fromPathString(path: string): any[];
}
