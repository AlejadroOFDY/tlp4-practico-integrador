import type { INotifier } from './INotifier.js';

export type NotifierChannel = 'inapp' | 'console';

export class NotifierFactory {
  constructor(
    private readonly inAppNotifier: INotifier,
    private readonly consoleNotifier: INotifier,
  ) {}

  create(channel: NotifierChannel): INotifier {
    if (channel === 'console') {
      return this.consoleNotifier;
    }
    return this.inAppNotifier;
  }
}
