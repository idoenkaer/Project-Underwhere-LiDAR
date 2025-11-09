// services/errorHunter.ts
import { captureException, captureMessage } from './sentryService';

/**
 * Attaches global error handlers to catch and log unhandled exceptions and promise rejections.
 */
if (typeof window !== 'undefined') {
    window.onerror = function(message, source, lineno, colno, error) {
        console.error("[Global Error]", { message, source, lineno, colno, stack: error?.stack });
        // In a production environment, you would log these errors to a backend service.
        captureException(error || new Error(message as string));
        return false; // Return false to allow the default browser handler to run.
    };

    window.onunhandledrejection = function(event: PromiseRejectionEvent) {
        console.error("[Promise Rejection]", event.reason || event);
        // In a production environment, you would log these errors.
        if (event.reason instanceof Error) {
            captureException(event.reason);
        } else {
            captureMessage(`Unhandled Promise Rejection: ${event.reason}`);
        }
    };
}