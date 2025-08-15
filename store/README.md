# Redux Store with Persistence

This store is configured with `redux-persist` to automatically save and restore the Redux state to/from AsyncStorage.

## Features

- **Automatic Persistence**: User state is automatically saved to AsyncStorage
- **App Restart Recovery**: User remains logged in after app restart
- **TypeScript Support**: Full type safety for all actions and state
- **Clean State Management**: Proper logout and state clearing

## How It Works

1. **Store Configuration**: The store is wrapped with `persistReducer` and `persistStore`
2. **PersistGate**: The app is wrapped with `PersistGate` to ensure persistence is ready before rendering
3. **Whitelist**: Only `pos` and `user` states are persisted (others are not saved)
4. **AsyncStorage**: Data is stored in the device's AsyncStorage

## Usage

### Login a User

```typescript
import { loginUserHelper } from "../store/helpers/authHelpers";

const handleLogin = async (credentials) => {
  try {
    const response = await loginAPI(credentials);

    if (response.success) {
      // This will automatically persist to AsyncStorage
      loginUserHelper({
        id: response.user.id,
        name: response.user.name,
        phone: response.user.phone,
        warehouse: response.user.warehouse,
        type: response.user.type,
        email: response.user.email,
        token: response.token,
      });

      router.replace("/(drawer)/(tabs)");
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

### Logout a User

```typescript
import { logoutUserHelper } from "../store/helpers/authHelpers";

const handleLogout = () => {
  logoutUserHelper(); // This clears the persisted state
  router.replace("/(auth)/sign-in");
};
```

### Access User State

```typescript
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const user = useSelector((state: any) => state.user);

  if (user.isLoggedIn) {
    return <Text>Welcome, {user.name}!</Text>;
  }

  return <Text>Please log in</Text>;
};
```

## State Structure

```typescript
interface UserState {
  id: string;
  name: string;
  phone: string;
  warehouse: string;
  isLoggedIn: boolean;
  type: string;
  email: string;
  token?: string;
}
```

## Persistence Configuration

- **Storage**: AsyncStorage
- **Key**: "root"
- **Whitelist**: ["pos", "user"]
- **Serialization**: Handled automatically by redux-persist

## Testing Persistence

1. Login with valid credentials
2. Force close the app completely
3. Reopen the app
4. User should still be logged in
5. Check console logs for persistence confirmation

## Troubleshooting

- **State not persisting**: Check if `PersistGate` is properly wrapping your app
- **Login state lost**: Verify the user state is in the whitelist
- **Performance issues**: Consider adding more specific whitelist items
- **Storage errors**: Check AsyncStorage permissions and available space
