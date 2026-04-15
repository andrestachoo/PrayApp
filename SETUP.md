# Habita — Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 15+ (Mac only)
- Android: Android Studio + emulator, or physical device

---

## 1. Install dependencies

```bash
cd PrayingApp
npm install
```

If you hit peer dependency warnings, use:

```bash
npm install --legacy-peer-deps
```

---

## 2. Add placeholder assets

Expo requires icon and splash images. Create simple placeholder PNGs or copy yours:

```bash
# Minimum required files (1024×1024 PNG for icon, any PNG for splash):
assets/icon.png
assets/splash.png
assets/adaptive-icon.png   # Android adaptive icon foreground
assets/notification-icon.png  # Android notification icon (96×96 monochrome PNG)
```

A quick way to create placeholders (requires ImageMagick):

```bash
convert -size 1024x1024 xc:#2C4A3E assets/icon.png
convert -size 1024x1024 xc:#FAF8F5 assets/splash.png
cp assets/icon.png assets/adaptive-icon.png
convert -size 96x96 xc:#FFFFFF assets/notification-icon.png
```

Or use any placeholder image service and rename the files.

---

## 3. Start the development server

```bash
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press:
- `i` — open in iOS Simulator
- `a` — open in Android Emulator

---

## 4. First run experience

1. The app opens to **Onboarding** (since `hasCompletedOnboarding` is `false`)
2. Choose your tone, categories, schedule, and grant notification permissions
3. You're taken to the **Home** screen

To reset onboarding: Settings → Restart onboarding

---

## 5. Running on a physical device (recommended for notifications)

Local notifications **do not work in Expo Go** on some setups. For full testing:

```bash
# Create a development build
npx expo run:ios       # requires Xcode
npx expo run:android   # requires Android Studio
```

Or use EAS Build (Expo's cloud build service):

```bash
npm install -g eas-cli
eas login
eas build --profile development --platform ios
```

---

## Project structure

```
PrayingApp/
├── app/
│   ├── _layout.tsx            Root layout — hydration, notification listener
│   ├── prompt.tsx             Prompt modal screen
│   ├── (tabs)/
│   │   ├── _layout.tsx        Tab bar — redirects to onboarding if needed
│   │   ├── index.tsx          Home screen
│   │   └── settings.tsx       Settings screen
│   └── onboarding/
│       └── index.tsx          Multi-step onboarding flow
│
├── components/
│   ├── ui/                    Primitive components (HText, HButton, HCard, Divider)
│   ├── CategoryPicker.tsx
│   ├── CategoryBadge.tsx
│   ├── TonePicker.tsx
│   ├── DayPicker.tsx
│   ├── TimeWindowPicker.tsx
│   ├── RemindersSlider.tsx
│   ├── StatsCard.tsx
│   └── SettingsRow.tsx
│
├── constants/
│   ├── theme.ts               Colors, typography, spacing, shadows
│   └── defaults.ts            Default settings and stats
│
├── data/
│   └── prompts.ts             105 prompt objects (seed dataset)
│
├── features/
│   ├── notifications/
│   │   ├── permissions.ts     Permission request logic
│   │   └── scheduler.ts       Scheduling engine
│   └── prompts/
│       └── selector.ts        Random prompt selection
│
├── hooks/
│   ├── useHydration.ts        Store hydration + i18n init
│   ├── useNotifications.ts    Notification scheduling + tap handling
│   └── usePrompt.ts           Prompt state for the prompt screen
│
├── i18n/
│   ├── index.ts               t() and tp() functions
│   ├── en.json                English strings
│   └── es.json                Spanish strings
│
├── lib/
│   ├── date.ts                Date utilities + scheduling math
│   └── storage.ts             AsyncStorage helpers
│
├── store/
│   └── useAppStore.ts         Zustand store (settings + stats + notifications)
│
└── types/
    └── index.ts               All TypeScript types
```

---

## Adding a new language

1. Copy `i18n/en.json` → `i18n/fr.json` (for French)
2. Translate all strings
3. Register it in `i18n/index.ts`:

```ts
import fr from './fr.json';

const translations = { en, es, fr };
```

4. Add the option to the settings language selector

---

## Adding new prompts

Open `data/prompts.ts` and add objects following the `Prompt` type:

```ts
{
  id: 'your-unique-id',          // must be unique
  category: 'gratitude',          // one of the 8 categories
  tones: ['warm', 'direct'],      // which tones this fits
  tradition: 'general',           // 'general' or 'catholic'
  title: 'Short title',
  body: 'The main invitation text.',
  reflection: 'Optional deeper thought.',
  suggestedDuration: 60,          // seconds (optional)
}
```

---

## iOS Notification Limitations

- **Maximum 64** pending local notifications at one time.
  - Habita schedules up to 7 days × 10 reminders = 70 max. At 10 reminders/day this approaches the limit.
  - For >7 reminders/day, reduce `MAX_SCHEDULED_DAYS` in `constants/defaults.ts`.
- Notifications **require a physical device** or provisioned simulator for testing.
- The `UNUserNotificationCenter` delegate is managed by `expo-notifications` — do not create a second delegate.

## Android Notification Limitations

- Android 13+ (API 33) requires the `POST_NOTIFICATIONS` runtime permission — already handled in `permissions.ts`.
- Notifications may be delayed on devices with aggressive battery optimization (MIUI, EMUI, etc.). Consider advising users to whitelist the app.
- Notification channels are created automatically by `expo-notifications`.

---

## Suggested post-V1 improvements

### Content
- [ ] More prompts per category (especially examen and intercession)
- [ ] Seasonal / liturgical calendar awareness (Lent, Advent, etc.)
- [ ] Prompt packs as optional in-app purchases
- [ ] Community-contributed prompts (moderated)

### Features
- [ ] Widgets (iOS 16 WidgetKit, Android App Widgets)
- [ ] Haptic feedback on "I prayed"
- [ ] Export prayer journal as PDF
- [ ] Journaling — brief free-text note after each prayer
- [ ] iCloud / Google sync (optional, opt-in)
- [ ] "Lectio Divina" mode — longer, Scripture-based prompts
- [ ] Custom notification sounds (ambient, gentle tones)

### Technical
- [ ] Expo EAS Update for OTA content refreshes
- [ ] Sentry error reporting
- [ ] Analytics (opt-in, privacy-first — e.g., PostHog self-hosted)
- [ ] App Store ratings prompt after 7-day streak
- [ ] Accessibility audit (VoiceOver, TalkBack)
- [ ] iPad layout

### Monetization
- [ ] One-time purchase unlock (lifetime)
- [ ] "Tip jar" IAP for gratitude-based support
- [ ] Unlock additional prompt packs
