// services/validationService.ts
import { PhysicsScenario } from '../types';

/**
 * Validates the structure of a PhysicsScenario object.
 * @param data - The object to validate.
 * @returns An object with `isValid` and an `errors` array.
 */
export const validatePhysicsScenario = (data: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (typeof data !== 'object' || data === null) {
        return { isValid: false, errors: ['Data is not an object.'] };
    }

    // Check required top-level properties
    const requiredProps: (keyof PhysicsScenario)[] = ['id', 'windSpeed', 'windDirection', 'results', 'recommendations'];
    for (const prop of requiredProps) {
        if (!(prop in data)) {
            errors.push(`Missing required property: '${prop}'.`);
        }
    }

    if (typeof data.id !== 'string') errors.push("'id' must be a string.");
    if (typeof data.windSpeed !== 'number') errors.push("'windSpeed' must be a number.");
    
    // Check nested results object
    if (typeof data.results !== 'object' || data.results === null) {
        errors.push("'results' must be an object.");
    } else {
        const requiredResultsProps: (keyof PhysicsScenario['results'])[] = ['stress', 'deformation', 'integrity'];
        for (const prop of requiredResultsProps) {
            if (!(prop in data.results)) {
                errors.push(`Missing required property in results: '${prop}'.`);
            } else if (typeof data.results[prop] !== 'number') {
                errors.push(`Property '${prop}' in results must be a number.`);
            }
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};