/**
 * Shim for node:path.normalize
 * @param path string
 * @returns string
 */
export function normalize(path: string): string {
  // Simple path normalization
  const isAbsolute = path.startsWith('/');
  const parts = path.split(/[/\\]+/).filter(Boolean);
  const normalizedParts: string[] = [];

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      normalizedParts.pop();
    } else {
      normalizedParts.push(part);
    }
  }

  return (isAbsolute ? '/' : '') + normalizedParts.join('/');
}

/**
 * Shim for node:path.join
 * @param paths string[]
 * @returns string
 */
export function join(...paths: string[]): string {
  return normalize(paths.join('/'));
}
