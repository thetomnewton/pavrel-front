import * as Sentry from '@sentry/vue'
import { App } from 'vue'
import { Router } from 'vue-router'
import { BrowserTracing } from '@sentry/tracing'

export function startSentry(app: App, router: Router) {
  Sentry.init({
    app,
    dsn: 'https://74dfd83356fe4f48bc1a0ce83759a713@o1124884.ingest.sentry.io/6163193',
    environment: import.meta.env.MODE,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', 'pavrel.com', /^\//],
      }),
    ],
    logErrors: true,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}
