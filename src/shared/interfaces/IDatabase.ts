export interface IDatabase {
  connectDatabase(): Promise<void>
}
