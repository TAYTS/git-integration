import crypto from 'crypto';

export function secureRandom(): string {
  return crypto.randomInt(0, 1000000).toString(6).padStart(6, '0');
}
