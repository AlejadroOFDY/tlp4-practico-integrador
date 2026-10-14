import { Notification } from './Notification.js';
import { Permission } from './Permission.js';
import { Role } from './Role.js';
import { Subscription } from './Subscription.js';
import { Ticket } from './Ticket.js';
import { User } from './User.js';

Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

Role.belongsToMany(Permission, {
  through: 'role_permissions',
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: 'role_permissions',
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  as: 'roles',
});

User.belongsToMany(Ticket, {
  through: Subscription,
  foreignKey: 'userId',
  otherKey: 'ticketId',
  as: 'tickets',
});
Ticket.belongsToMany(User, {
  through: Subscription,
  foreignKey: 'ticketId',
  otherKey: 'userId',
  as: 'subscribers',
});

User.hasMany(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });
Ticket.hasMany(Subscription, { foreignKey: 'ticketId' });
Subscription.belongsTo(Ticket, { foreignKey: 'ticketId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });
Ticket.hasMany(Notification, { foreignKey: 'ticketId' });
Notification.belongsTo(Ticket, { foreignKey: 'ticketId' });
