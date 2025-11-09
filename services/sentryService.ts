// This file mocks the Sentry SDK for demonstration purposes.
// In a real application, you would `npm install @sentry/react` and use the real SDK.

interface User {
    id?: string;
    email?: string;
}

interface SentryMock {
    isInitialized: boolean;
    init: (options: { dsn: string; integrations?: any[]; tracesSampleRate?: number, environment?: string }) => void;
    captureException: (error: Error, context?: any) => string;
    captureMessage: (message: string) => string;
    setUser: (user: User | null) => void;
    captureUserFeedback: (feedback: { event_id: string; comments: string; name?: string, email?: string }) => void;
}

const Sentry: SentryMock = {
    isInitialized: false,
    init(options) {
        if (this.isInitialized) {
            console.warn("Sentry Service: Already initialized.");
            return;
        }
        if (!options.dsn) {
            console.error("Sentry Service: DSN not provided. Sentry will not be initialized.");
            return;
        }
        console.log(`%c[Sentry Service Initialized]`, 'color: #0FFF50; font-weight: bold;', {
            dsn: '********', // Hide DSN for security
            environment: options.environment,
            tracesSampleRate: options.tracesSampleRate,
        });
        this.isInitialized = true;
    },
    captureException(error, context) {
        const eventId = `event-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        if (!this.isInitialized) {
            console.warn("Sentry Service: captureException called but not initialized. Error was not sent.");
            return eventId;
        }
        console.log(`%c[Sentry Capture Exception]`, 'color: #FF4444; font-weight: bold;', {
            eventId,
            error: error.message,
            stack: error.stack,
            context,
        });
        return eventId;
    },
    captureMessage(message) {
         const eventId = `event-${Date.now()}-${Math.random().toString(36).substring(2)}`;
        if (!this.isInitialized) {
            console.warn("Sentry Service: captureMessage called but not initialized. Message was not sent.");
            return eventId;
        }
        console.log(`%c[Sentry Capture Message]`, 'color: #FFAA00; font-weight: bold;', { eventId, message });
        return eventId;
    },
    setUser(user) {
        if (!this.isInitialized) return;
        console.log(`%c[Sentry Set User]`, 'color: #00CCFF; font-weight: bold;', user);
    },
    captureUserFeedback(feedback) {
        if (!this.isInitialized) {
             console.warn("Sentry Service: captureUserFeedback called but not initialized. Feedback was not sent.");
             return;
        }
         console.log(`%c[Sentry User Feedback Received]`, 'color: #00FF00; font-weight: bold;', feedback);
    }
};

// Export functions that wrap the Sentry mock object
export const initSentry = () => {
    Sentry.init({
        dsn: "https://mock.dsn.sentry.io/12345",
        integrations: [/* Mock integrations if needed */],
        tracesSampleRate: 1.0,
        environment: "development",
    });
    // Set a mock user
    Sentry.setUser({ id: "user-123", email: "e.reed@example.com" });
};

export const captureException = (error: Error, context?: any) => {
    return Sentry.captureException(error, context);
};

export const captureMessage = (message: string) => {
    return Sentry.captureMessage(message);
};

export const captureUserFeedback = (feedback: { event_id: string; comments: string; name?: string, email?: string }) => {
    Sentry.captureUserFeedback(feedback);
};

// Default export for import map compatibility in index.html
export default Sentry;