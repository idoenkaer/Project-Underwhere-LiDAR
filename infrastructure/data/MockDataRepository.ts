import { IScientificDataRepository } from '../../application/repositories/IScientificDataRepository';
import { ScientificDatabase } from '../../types';
import { db } from './mockData';

export class MockDataRepository implements IScientificDataRepository {
  async getDatabase(): Promise<ScientificDatabase> {
    // Simulate async call for future real implementations
    return Promise.resolve(db);
  }
}
