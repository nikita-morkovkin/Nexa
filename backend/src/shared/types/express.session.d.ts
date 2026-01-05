import 'express';
import 'express-session';
import type { User } from '../../modules/auth/account/models/user.model';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    createdAt?: Date | string;
  }
}

declare module 'express' {
  interface Request {
    user?: User;
    res?: Response;
  }
}
