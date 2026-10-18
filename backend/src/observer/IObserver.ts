import type { TicketStatusEvent } from './TicketStatusEvent.js';

export interface IObserver {
  update(event: TicketStatusEvent): Promise<void>;
}
