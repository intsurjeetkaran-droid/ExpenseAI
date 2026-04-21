# 📱 Mobile App Build Guide - AI Expense Tracker

## 🎯 Overview

This guide explains how to build the Android APK for AI Expense Tracker using Capacitor.

---

## 📋 Prerequisites

### Required Software:
- **Node.js** 20+ (for Capacitor 6)
- **Android Studio** (for building APK)
- **Java JDK** 17+ (included with Android Studio)
- **Android SDK** (installed via Android Studio)

### Optional:
- **Gradle** (included with Android project)

---

## 🚀 Quick Build

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync with Android
```bash
npx cap sync android
```

### 4. Build APK
```bash
cd android
./gradlew assembleDebug
```

### 5. Find Your APK
```
frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 Build Types

### Debug Build (Current)
- **Command:** `./gradlew assembleDebug`
- **Output:** `app-debug.apk`
- **Size:** ~4 MB
- **Use Case:** Testing, development
- **Signing:** Debug keystore (auto-generated)

### Release Build (Production)
- **Command:** `./gradlew assembleRelease`
- **Output:** `app-release-unsigned.apk`
- **Size:** ~3 MB (optimized)
- **Use Case:** Production, Play Store
- **Signing:** Requires release keystore

---

## 🔐 Creating Release Build

### Step 1: Generate Keystore
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Configure Gradle
Edit `frontend/android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("my-release-key.keystore")
            storePassword "your-password"
            keyAlias "my-key-alias"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Build Release APK
```bash
cd frontend/android
./gradlew assembleRelease
```

### Step 4: Find Release APK
```
frontend/android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎨 Customization

### App Icon
Replace icons in:
```
frontend/android/app/src/main/res/
├── mipmap-hdpi/
├── mipmap-mdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
```

### App Name
Edit `frontend/android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">AI Expense Tracker</string>
```

### Package Name
Edit `frontend/capacitor.config.json`:
```json
{
  "appId": "com.expenseai.app"
}
```

### Version
Edit `frontend/android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 1
        versionName "1.0.0"
    }
}
```

---

## 🔧 Troubleshooting

### Issue: Gradle build fails
**Solution:** Make sure Android SDK is installed
```bash
# Check SDK location
echo $ANDROID_HOME
# or
echo $ANDROID_SDK_ROOT
```

### Issue: Java version error
**Solution:** Use Java 17
```bash
java -version
# Should show Java 17+
```

### Issue: Capacitor sync fails
**Solution:** Rebuild web assets
```bash
npm run build
npx cap sync android
```

### Issue: APK not found
**Solution:** Check build output
```bash
cd frontend/android
./gradlew assembleDebug --info
```

---

## 📱 Testing APK

### On Physical Device:
1. Enable **Developer Options** on Android device
2. Enable **USB Debugging**
3. Connect device via USB
4. Run: `adb install app-debug.apk`

### On Emulator:
1. Open Android Studio
2. Start an emulator
3. Drag and drop APK onto emulator

### Manual Install:
1. Transfer APK to device
2. Open file manager
3. Tap APK file
4. Allow installation from unknown sources
5. Install

---

## 🚀 Publishing to Play Store

### 1. Create Release Build
```bash
./gradlew bundleRelease
```

### 2. Generate AAB (Android App Bundle)
Output: `app/build/outputs/bundle/release/app-release.aab`

### 3. Upload to Play Console
- Go to Google Play Console
- Create new app
- Upload AAB file
- Fill in store listing
- Submit for review

---

## 📊 Build Optimization

### Reduce APK Size:
1. Enable ProGuard (minification)
2. Remove unused resources
3. Use WebP images instead of PNG
4. Enable code shrinking

### Improve Performance:
1. Use release build
2. Enable R8 optimization
3. Optimize images
4. Lazy load components

---

## 🔄 Continuous Integration

### GitHub Actions Example:
```yaml
name: Build Android APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Build web
        run: cd frontend && npm run build
      - name: Sync Capacitor
        run: cd frontend && npx cap sync android
      - name: Build APK
        run: cd frontend/android && ./gradlew assembleDebug
      - name: Upload APK
        uses: actions/upload-artifact@v2
        with:
          name: app-debug.apk
          path: frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📝 Version Management

### Update Version:
1. Edit `frontend/android/app/build.gradle`
2. Increment `versionCode` (integer)
3. Update `versionName` (string)
4. Rebuild APK

Example:
```gradle
versionCode 2
versionName "1.1.0"
```

---

## 🎉 Success!

Your APK is ready to distribute! 🚀

For questions or issues, open a GitHub issue:
https://github.com/intsurjeetkaran-droid/ExpenseAI/issues
