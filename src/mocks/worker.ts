import { setupWorker } from 'msw';
import { BASE_API_URL } from '@/hooks/fetcher'

import { handlers as friendHandlers } from './friend';
import { loginHandler } from './login'

export function api(path: string) {
  return new URL(path, BASE_API_URL).toString();
}

const handlers = [...friendHandlers, loginHandler]

export const worker = setupWorker(...handlers);
