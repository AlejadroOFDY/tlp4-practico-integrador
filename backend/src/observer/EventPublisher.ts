import type { IObserver } from './IObserver.js';
import type { ISubject } from './ISubject.js';
import type { TicketStatusEvent } from './TicketStatusEvent.js';

export class EventPublisher implements ISubject {
  private observers: IObserver[] = [];

  attach(observer: IObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: IObserver): void {
    this.observers = this.observers.filter((current) => current !== observer);
  }

  async notify(event: TicketStatusEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(event);
    }
  }
}
