# Build Instructions

## Fix Build Error: package-lock.json Out of Sync

The build is failing because `package-lock.json` is out of sync with `package.json`. The lock file is missing `expo-network@6.0.1` which was recently added.

### Solution

**You must regenerate `package-lock.json` locally before building:**

1. **Delete the old lock file:**
   ```bash
   # Windows PowerShell
   Remove-Item package-lock.json
   
   # Or Windows CMD
   del package-lock.json
   ```

2. **Regenerate the lock file:**
   ```bash
   npm install
   ```
   
   This will create a new `package-lock.json` that matches your `package.json`.

3. **Commit the new lock file:**
   ```bash
   git add package-lock.json
   git commit -m "Regenerate package-lock.json with expo-network"
   git push
   ```

4. **Run the build again:**
   ```bash
   npx eas build -p android --profile preview
   ```

## Why This Happened

We replaced `@react-native-community/netinfo` with `expo-network` for better Expo SDK 54 compatibility, but the lock file wasn't updated.

## Alternative: Use npm install instead of npm ci (Not Recommended)

If you can't regenerate the lock file right now, you can temporarily configure EAS to use `npm install` instead of `npm ci` by adding this to `eas.json`:

```json
{
  "build": {
    "preview": {
      "node": "20.x.x",
      "env": {
        "NPM_CONFIG_CI": "false"
      }
    }
  }
}
```

However, **regenerating package-lock.json is the recommended solution**.

