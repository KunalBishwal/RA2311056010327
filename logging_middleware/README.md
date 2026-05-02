# Logging Middleware

Shared logging middleware for the Campus Notification System.

## Usage

The `Log()` function sends structured log events to the external evaluation service.

```typescript
import { Log } from "../logging_middleware/logger";

Log("frontend", "info", "page", "Dashboard loaded");
```

## Implementation

See `notification_app_fe/logging_middleware/logger.ts` for the full implementation.
