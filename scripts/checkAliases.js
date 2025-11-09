const fs = require('fs');
const path = require('path');

// Directories to ignore during the scan.
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'scripts']);

/**
 * Recursively scans a directory for files containing disallowed import aliases.
 * @param {string} dir - The directory to scan.
 * @returns {string[]} - An array of file paths with issues.
 */
function scanDirForAliases(dir) {
    let issues = [];
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!IGNORED_DIRS.has(file)) {
                    issues = issues.concat(scanDirForAliases(fullPath));
                }
            } else if (/\.(t|j)sx?$/.test(file)) { // Match .js, .jsx, .ts, .tsx
                const content = fs.readFileSync(fullPath, 'utf8');
                // Use a more specific regex to target import statements.
                const importAliasRegex = /import(?:["'\s]*(?:[\w*{}\n\r\t, ]+)from\s*)?["'\s].*@\//;
                if (importAliasRegex.test(content)) {
                    issues.push(fullPath);
                }
            }
        }
    } catch (error) {
        // Fail gracefully if a directory can't be read (e.g., permissions)
        console.error(`Error scanning directory ${dir}:`, error);
    }
    return issues;
}

console.log('Scanning project for disallowed "@/" import aliases...');

// Start scanning from the project root. Assumes the script is run via `npm run ...`
const problematicFiles = scanDirForAliases('.'); 

if (problematicFiles.length > 0) {
    console.error('\n\x1b[31m%s\x1b[0m', 'ERROR: Found files using disallowed "@/" import aliases.');
    console.error('This project requires relative imports (e.g., \'../components\') for compatibility.');
    console.error('Please fix the imports in the following files:');
    problematicFiles.forEach(file => console.error(`  - ${file}`));
    process.exit(1);
} else {
    console.log('\x1b[32m%s\x1b[0m', '✅ Success: All imports use relative paths. No issues found.');
    process.exit(0);
}
