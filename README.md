# DailyDo 💪

A minimalist and modern habit tracker built with React Native and Expo. Track your daily habits, build streaks, and watch yourself grow — one day at a time.

---

## Screenshots

> Coming soon

---

## Features

- ✅ **Daily habit tracking** — tap to complete, long press to edit or delete
- 🔄 **Auto-reset** — habits reset automatically every day at midnight
- 📊 **Statistics** — track your streak, weekly progress, and all-time stats
- 🌙 **Light/Dark theme** — with persistent preference
- 🔔 **Daily notifications** — customizable reminder time
- 🎉 **Confetti animation** — celebrate when you complete all habits
- 🌱 **Onboarding** — guided setup on first launch
- 💾 **Persistent storage** — all data saved locally with AsyncStorage

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile framework |
| Expo (SDK 53) | Development platform |
| TypeScript | Type safety |
| Expo Router | File-based navigation |
| AsyncStorage | Local data persistence |
| Expo Notifications | Push/local notifications |
| React Native Reanimated | Smooth animations |
| React Native Confetti Cannon | Celebration animation |

---

## Project Structure

```
DailyDo/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── statistics.tsx
│   │   ├── settings.tsx
│   │   └── _layout.tsx
│   ├── _layout.tsx
│   └── onboarding.tsx
├── components/
│   └── HabitCard.tsx
├── constants/
│   └── habits.ts
├── context/
│   └── ThemeContext.tsx
├── storage/
│   └── habitStorage.ts
├── styles/
│   ├── homeScreen.ts
│   ├── exploreScreen.ts
│   ├── settingsScreen.ts
│   └── onboarding.ts
├── types/
│   └── habit.ts
└── utils/
    ├── notifications.ts
    └── statistics.ts
```

---

## Getting Started

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

Clone the repository:

```bash
git clone https://github.com/Antjuaan/DailyDo.git
cd DailyDo
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone or press `i` to open the iOS simulator.

---

## Try the App

### Option A — Expo Go (fastest)

1. Install [Expo Go](https://expo.dev/go) on your phone
2. Make sure your phone and computer are on the same Wi-Fi network
3. Run `npx expo start` and scan the QR code

### Option B — Android APK

Download the latest build directly — [Download here](https://github.com/Antjuaan/DailyDo/releases/download/1.0.0/application-6280117b-97e5-4426-9383-99520de20a54.apk).

Enable "Install from unknown sources" on your Android device, then open the downloaded `.apk` file to install.

### Option C — Build it yourself

Requires an [Expo account](https://expo.dev) and EAS CLI:

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

---

## Building for Production

### Android

```bash
eas build -p android --profile production
```

### iOS

Requires an Apple Developer Account:

```bash
eas build -p ios --profile production
```

### Publishing OTA updates

For JavaScript-only changes (no new native libraries):

```bash
eas update --branch preview --message "Description of changes"
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Author

**Antjuaan** — [GitHub](https://github.com/Antjuaan)