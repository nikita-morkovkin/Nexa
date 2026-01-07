import DeviceDetector from 'device-detector-js';
import type { Request } from 'express';
import { lookup } from 'geoip-lite';
import * as isoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import type { SessionMetadata } from '../types/session-metadata.types';
import { IS_DEV_ENV } from './is-dev.util';

isoCountries.registerLocale(enLocale);

export function getSessionMetadata(
  req: Request,
  userAgent: string,
): SessionMetadata {
  const ip = IS_DEV_ENV
    ? '173.166.164.121'
    : Array.isArray(req.headers['cf-connecting-ip'])
      ? req.headers['cf-connecting-ip'][0]
      : req.headers['cf-connecting-ip'] ||
        (typeof req.headers['x-forwarded-for'] === 'string'
          ? req.headers['x-forwarded-for'].split(',')[0]
          : req.ip);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const location = ip ? lookup(ip) : null;
  const deviceResult = new DeviceDetector().parse(userAgent);

  return {
    location: {
      country:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        isoCountries.getName(location?.country || '', 'en') ||
        'Неизвестная страна',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      city: location?.city || 'Неизвестный город',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      latitude: location?.ll?.[0] || 0,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      longitude: location?.ll?.[1] || 0,
    },
    device: {
      browser: deviceResult?.client?.name || 'Неизвестный браузер',
      os: deviceResult?.os?.name || 'Неизвестная операционная система',
      type: deviceResult?.device?.type || 'Неизвестное устройство',
    },
    ip: ip || 'Неизвестный IP',
  };
}
