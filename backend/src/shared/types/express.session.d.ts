import 'express';
import 'express-session';
import type { User } from '../../modules/auth/account/models/user.model';
import type { SessionMetadata } from './session-metadata.types';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    createdAt?: Date | string;
    // Change to SessionMetadata type
    metadata?: SessionMetadata;
  }
}

declare module 'express' {
  interface Request {
    user?: User;
    res?: Response;
  }
}
