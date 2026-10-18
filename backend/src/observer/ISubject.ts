import type { IObserver } from './IObserver.js';
import type { TicketStatusEvent } from './TicketStatusEvent.js';

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(event: TicketStatusEvent): Promise<void>;
}
