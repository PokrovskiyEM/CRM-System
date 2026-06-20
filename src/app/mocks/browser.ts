import { setupWorker } from 'msw/browser';
import { financeHandlers } from './handlers/financeHandlers';

export const worker = setupWorker(...financeHandlers);
