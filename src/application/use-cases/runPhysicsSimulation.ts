import { PhysicsScenario } from '../../types';
import { IScientificDataRepository } from '../repositories/IScientificDataRepository';
import { validatePhysicsScenario } from '../../services/validationService';

export const runPhysicsSimulation = async (
  repo: IScientificDataRepository,
  scenarioId: string
): Promise<PhysicsScenario> => {
  const startTime = performance.now();
  // Simulate processing delay that was previously in the component
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const db = await repo.getDatabase();
  const scenario = db.physics.scenarios.find(s => s.id === scenarioId);
  
  if (!scenario) {
    throw new Error(`Scenario with ID "${scenarioId}" not found.`);
  }

  // 1. Schema Validation
  const { isValid, errors } = validatePhysicsScenario(scenario);
  if (!isValid) {
    throw new Error(`[VALIDATION_ERROR] Scenario data is malformed: ${errors.join(', ')}`);
  }
  
  // 2. Scientific Outlier Detection
  const { stress, deformation, integrity } = scenario.results;
  if (integrity < 0 || integrity > 100) {
      throw new Error(`[OUTLIER_DETECTED] Integrity result (${integrity}%) is outside the scientifically plausible range of 0-100%.`);
  }
  if (stress < 0 || deformation < 0) {
       throw new Error(`[OUTLIER_DETECTED] Stress or deformation results are negative, which is physically implausible.`);
  }

  const endTime = performance.now();
  console.log(`[PERF] runPhysicsSimulation took ${(endTime - startTime).toFixed(2)}ms`);

  return scenario;
};
