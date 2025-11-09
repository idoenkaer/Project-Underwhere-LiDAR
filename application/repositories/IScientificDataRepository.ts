import { ScientificDatabase } from '../../types';

export interface IScientificDataRepository {
  getDatabase(): Promise<ScientificDatabase>;
}
