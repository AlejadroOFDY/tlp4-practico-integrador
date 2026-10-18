import type { INotifier, NotificationData } from './INotifier.js';

export class ConsoleNotifierAdapter implements INotifier {
  async send(data: NotificationData): Promise<void> {
    const text = `[NOTIFICACIÓN] Para: ${data.userEmail} | Ticket #${data.ticketId} | Estado: ${data.previousStatus} → ${data.newStatus}`;
    console.log(text);
  }
}
