import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';

export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private readonly sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
      host: env.db.host,
      port: env.db.port,
      dialect: 'postgres',
      logging: false,
    });
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  getSequelize(): Sequelize {
    return this.sequelize;
  }

  async connect(): Promise<void> {
    await this.sequelize.authenticate();
  }

  async close(): Promise<void> {
    await this.sequelize.close();
  }
}
