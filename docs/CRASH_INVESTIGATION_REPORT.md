# Crash Investigation Report: Accounts Tab Release Build

**Project:** FF Fashion (Ferrari Fashion App)  
**Issue:** Release-only crash when opening the Accounts tab  
**Date:** February 7, 2025  
**Status:** Resolved

---

## Executive Summary

The app was crashing immediately (without showing UI) when users opened the Accounts tab in **release builds only**. The issue did not occur in debug builds. This report documents the root causes identified and the fixes applied.

---

## Symptoms

- **Platform:** Android (release build)
- **Trigger:** Opening the Accounts tab (via drawer menu or tab bar)
- **Behavior:** App exits immediately without displaying any UI
- **Debug builds:** No crash observed

---

## Root Causes Identified

### 1. useColorScheme.web on Native Platform

**File:** `app/(drawer)/(tabs)/(account)/index.tsx`

The Accounts component imported `useColorScheme` from `@/hooks/useColorScheme.web` — a web-specific module. Platform-specific extensions (`.web`) can be excluded or resolved differently in release builds by Metro bundler, potentially causing module resolution failures or unexpected behavior on native platforms.

**Fix:** Switched to React Native's built-in `useColorScheme` hook from `react-native`.

---

### 2. Missing `backgroundColor` in Colors Constant

**File:** `constants/Colors.ts`

The code referenced `Colors[colorScheme ?? "dark"].backgroundColor` for header styling, but the `Colors` object only defined `background` — not `backgroundColor`. This resulted in `undefined` being passed to native style properties. In release builds, Hermes and native styling code paths can be stricter and may crash on invalid/undefined style values.

**Fix:** Added `backgroundColor` property to both `light` and `dark` theme objects in `Colors.ts`.

---

### 3. Unsafe userInfo Access in Drawer Layout

**File:** `app/(drawer)/_layout.tsx`

The drawer component used `userInfo.type === 'admin'` without optional chaining. When the drawer content renders (e.g., when navigating to Accounts), `userInfo` can be null during Redux persist rehydration or initial load. Accessing `.type` on null/undefined throws a TypeError.

**Fix:** Changed to `userInfo?.type === 'admin'` for null-safe access.

---

### 4. API Calls with Undefined Warehouse

**File:** `app/(drawer)/(tabs)/(account)/index.tsx`

`useTransactionListQuery` and `useWarehouseQuery` were called with `userInfo?.warehouse` before the user/warehouse was guaranteed to be loaded. This could produce invalid API URLs (e.g., `/transaction/list/undefined/deposit/...`) and cause edge-case failures in release.

**Fix:** Added `skip: !hasWarehouse` to all transaction list queries to prevent execution when warehouse is not yet available.

---

## Files Modified

| File | Changes |
|------|---------|
| `constants/Colors.ts` | Added `backgroundColor` to `light` and `dark` theme objects |
| `app/(drawer)/(tabs)/(account)/index.tsx` | Replaced `useColorScheme.web` with native hook; added `skip` to RTK Query calls |
| `app/(drawer)/_layout.tsx` | Added optional chaining to `userInfo.type` (2 occurrences) |

---

## Verification Steps

1. Build release APK:
   ```bash
   cd ferrari-fashion-app
   npx expo run:android --variant release
   ```

2. Install on device and sign in as a user with warehouse access.

3. Open the Accounts tab via:
   - Drawer menu → Accounts
   - Bottom tab bar → Account tab

4. Confirm the screen loads without crash.

---

## Recommendations

1. **Other screens using useColorScheme.web:** The following files also import the web-specific hook. Consider updating them to use the native `useColorScheme` for consistency:
   - `app/(drawer)/reports/index.tsx`
   - `app/user/index.tsx`
   - `app/settings/index.tsx`

2. **Play Console stack trace:** If the crash recurs, provide the Play Console crash stack trace for precise diagnosis.

3. **Global Colors usage:** Several files reference `Colors[].backgroundColor`. Ensure all are now covered by the updated `Colors.ts` constant.

---

## Appendix: Technical Notes

- **Expo/React Native:** Platform-specific file extensions (`.web`, `.native`, `.ios`, `.android`) affect which modules are bundled for each build target.
- **Release vs Debug:** Release builds use Hermes bytecode, minification, and optimized native paths. Debug builds tolerate more edge cases.
- **Redux Persist:** State rehydration from AsyncStorage is asynchronous; components may render before `userInfo` is fully hydrated.

---

*Report generated from crash investigation session.*
