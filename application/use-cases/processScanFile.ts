export const processScanFile = async (file: File): Promise<'processed'> => {
  // Simulate validation
  if (!['text/csv', 'application/vnd.las'].includes(file.type) && !file.name.endsWith('.las') && !file.name.endsWith('.xyz')) {
     throw new Error('Invalid File Format');
  } 
  if (file.size > 10 * 1024 * 1024) { // Mock validation: size check
      throw new Error('Data Out of Range');
  }
  
  // Simulate processing pipeline (4 steps * 750ms = 3000ms)
  await new Promise(resolve => setTimeout(resolve, 3000));
  return 'processed';
}

export const loadMockScan = async (): Promise<'processed'> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return 'processed';
}

export const importExternalDataset = async (): Promise<'processed'> => {
    // Simulate API fetch and data processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    return 'processed';
}