# FFApp - Fashion Store Mobile Application

A modern React Native mobile application built with Expo for fashion retail management, featuring POS functionality, inventory management, and customer management.

## 🚀 Features

- **Point of Sale (POS)** - Complete sales transaction management
- **Inventory Management** - Product catalog, stock tracking, and warehouse management
- **Customer Management** - Customer profiles and relationship management
- **Supplier Management** - Vendor and supplier relationship tracking
- **User Authentication** - Secure login with JWT tokens
- **Redux State Management** - Centralized state management with persistence
- **Responsive UI** - Built with NativeWind (Tailwind CSS for React Native)
- **Multi-platform** - iOS, Android, and Web support

## 🛠️ Tech Stack

- **React Native** (0.79.5)
- **Expo** (~53.0.20)
- **TypeScript** (~5.8.3)
- **NativeWind** (^4.1.23) - Tailwind CSS for React Native
- **Redux Toolkit** with RTK Query for API management
- **React Navigation** - Navigation solution
- **AsyncStorage** - Local data persistence
- **JWT** - Authentication tokens
- **Expo Router** - File-based routing

## 📱 Dependencies

### Core Dependencies
- `expo-router` - File-based navigation
- `react-navigation` - Navigation components
- `@reduxjs/toolkit` - State management
- `react-redux` - React bindings for Redux
- `redux-persist` - Redux state persistence
- `@react-native-async-storage/async-storage` - Local storage
- `jwt-decode` - JWT token decoding
- `date-fns` - Date utilities
- `react-native-css-interop` - CSS interop for NativeWind

### UI & Media
- `expo-image` - Optimized image component
- `expo-image-picker` - Image selection
- `expo-image-manipulator` - Image processing
- `react-native-chart-kit` - Charts and graphs
- `react-native-element-dropdown` - Dropdown components
- `react-native-paper-dates` - Date picker components

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FFApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on specific platforms**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 📁 Project Structure

```
FFApp/
├── app/                    # App screens and layouts
│   ├── (auth)/            # Authentication screens
│   ├── (drawer)/          # Main app with drawer navigation
│   │   └── (tabs)/        # Tab navigation screens
│   ├── customer/          # Customer management
│   ├── supplier/          # Supplier management
│   ├── stock/             # Inventory screens
│   └── settings/          # Settings screens
├── assets/                # Static assets
│   ├── fonts/            # Custom fonts
│   ├── images/           # Images
│   └── icons/            # Icon assets
├── components/           # Reusable components
│   └── ui/              # UI components
├── constants/           # App constants
├── context/            # React contexts
├── hooks/              # Custom React hooks
├── store/              # Redux store setup
│   ├── api/           # RTK Query APIs
│   └── slice/         # Redux slices
└── models/            # TypeScript type definitions
```

## 🔧 Configuration

### Environment Setup

Create a `.env` file in the root directory:

```env
API_BASE_URL=your_api_base_url
JWT_SECRET=your_jwt_secret
```

### NativeWind Configuration

The project uses NativeWind v4 for styling. Configuration is already set up in:
- `tailwind.config.js` - Tailwind configuration
- `metro.config.js` - Metro bundler configuration
- `babel.config.js` - Babel configuration
- `global.css` - Global styles

## 🏗️ Development

### Code Style

- **ESLint** - Code linting
- **TypeScript** - Type safety
- **Prettier** - Code formatting

### Key Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web

# Lint code
npm run lint

# Reset project (clear cache)
npm run reset-project
```

## 🔐 Authentication

The app uses JWT-based authentication with the following flow:
1. User login with credentials
2. Server returns JWT token
3. Token stored in AsyncStorage
4. Token included in API requests
5. Auto-refresh mechanism for expired tokens

## 📊 State Management

Redux Toolkit is used for state management with:
- **User slice** - User authentication and profile
- **POS slice** - Point of sale data
- **Settings slice** - App settings
- **RTK Query APIs** - Server state management

## 🎨 Styling

The app uses NativeWind (Tailwind CSS for React Native) for styling:
- Utility-first CSS framework
- Responsive design support
- Dark mode support
- Custom theme configuration

## 📱 Navigation

File-based routing with Expo Router:
- **Tabs** - Main app navigation
- **Drawer** - Side menu navigation
- **Stack** - Screen stack navigation
- **Auth** - Authentication flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](../../issues) section
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about the issue

## 🔄 Updates

To update dependencies:

```bash
# Update Expo SDK
expo upgrade

# Update other dependencies
npm update
```

---

**Happy Coding!** 🎉