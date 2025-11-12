# NimirUp Mobile App

Expo / React Native client for the NimirUp smart posture system. The app connects to BLE posture devices, syncs data with the backend every five minutes, and surfaces AI-driven insights and exercise recommendations.

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Android Studio and/or Xcode simulators (optional but recommended)
- A configured backend that implements the endpoints listed below
- Google Cloud project with OAuth Web Client ID for Google Sign-In

## Installation

```bash
npm install
```

Create an `.env` file (or set Expo environment variables via `app.config.js`/`app.json`) with:

```env
EXPO_PUBLIC_API_URL=https://your-api.com/api
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id
```

- `EXPO_PUBLIC_API_URL` – root of your backend REST API.
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` – OAuth 2.0 **Web** client ID from Google Cloud Console.

## Running the app

```bash
npx expo start
```

Use the on-screen prompts to launch on Expo Go, an Android emulator, or an iOS simulator.

## Backend expectations

All requests include the Google access (or ID) token in the `Authorization` header:

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Endpoints to implement

| Method | Path | Description |
| --- | --- | --- |
| GET | `/user/details` | Return authenticated user profile. |
| GET | `/exercises` | Return all exercises. Supports optional `?bodyPart=neck`. |
| GET | `/exercises/top?limit=4` | Return top exercises (defaults to 4). |
| GET | `/recommendations/top` | Return top personalized recommendations. |
| GET | `/insights/recent` | Return recent insights (alert levels 1–5). |
| POST | `/bluetooth/data/batch` | Accept batch of BLE readings gathered offline. |
| POST | `/device/send` | Forward AI/LSTM message to the user’s ESP32 device. |
| POST | `/analysis/result` | Store analysis output produced by the local LSTM. |

### Request / response payloads

#### POST `/bluetooth/data/batch`

**Request**

```json
{
  "data": [
    {
      "id": "ble1",
      "timestamp": 1704067200000,
      "deviceId": "device123",
      "value": "sensor_value",
      "raw": "base64_raw_optional"
    }
  ]
}
```

**Response**

```json
{
  "success": true,
  "syncedCount": 1
}
```

#### POST `/device/send`

```json
{
  "deviceId": "device123",
  "message": "{\"alertLevel\":1,\"message\":\"Posture alert\",\"timestamp\":1704067200000}"
}
```

#### POST `/analysis/result`

```json
{
  "data": [
    {
      "timestamp": 1704067200000,
      "value": "sensor_value",
      "raw": "base64_raw_optional"
    }
  ],
  "alertLevel": 1,
  "message": "Posture analysis complete",
  "bodyPart": "neck",
  "recommendation": "Try neck stretch exercise"
}
```

All GET endpoints should return arrays of objects shaped as the app expects:

- **Insight** – `{ id, alertLevel (1-5), message, timestamp, bodyPart?, description?, suggestion? }`
- **Exercise** – `{ id, title, bodyPart, duration?, difficulty?, description? }`
- **Recommendation** – `{ id, title, priority, impact, bodyPart? }`
- **User Details** (GET `/user/details`) – Returns a single object:
  ```json
  {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "photo": "https://example.com/photo.jpg",
    "sessions": 24,
    "streak": 7,
    "postureScore": 85,
    "createdAt": "2024-01-01T00:00:00Z"
  }
  ```
  - `sessions` (number): Total number of sessions
  - `streak` (number): Current streak in days
  - `postureScore` (number): Posture score percentage (0-100)
  - If no data exists, return `0` for numeric fields and `null` or empty string for `name` (app will show "Default User")

If the backend is unreachable, the app displays `0` values instead of errors, so simple empty arrays/objects are fine for fallback.

## Firebase / token verification

The mobile app performs Google Sign-In using `@react-native-google-signin/google-signin`. It sends the Google access token (or you can modify it to send the ID token) with every API call.

In the backend:

1. Install the Firebase Admin SDK (or use Google OAuth token verification directly).
2. Verify the incoming token for each request. A Node example:

```ts
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}
```

> **Tip:** If you prefer ID tokens, have the app send `userInfo.idToken` instead of the access token and verify via `verifyIdToken`.

### Backend environment variables

```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
APP_JWT_SECRET=optional-if-you-issue-your-own-tokens
```

- Use a Google service account with Firebase Admin permissions (do **not** ship these credentials in the app).
- You may exchange the verified Google token for your own JWT if you want shorter tokens or custom claims.

## Data flow summary

1. User signs in with Google → token stored via AsyncStorage.
2. BLE readings are stored locally in SQLite (`services/database.ts`) and synced via `/bluetooth/data/batch`.
3. Insights, exercises, and recommendations are fetched from the backend every time the relevant screens load; the app falls back to `0` values when offline.
4. The LSTM service (`services/lstm.ts`) is ready to load a `.h5` model and post results to `/analysis/result` or `/device/send`.

## Useful scripts

```bash
npm install        # install dependencies
npx expo start     # run the app
npm run android    # build/dev on Android
npm run ios        # build/dev on iOS
```

Feel free to extend this README with deployment instructions or backend repository links as your platform evolves.
