import { loginUser, logoutUser, setUserInfo } from "../slice/userSlice";
import { store } from "../store";

// Helper function to log in a user
export const loginUserHelper = (userData: {
  id: string;
  name: string;
  phone: string;
  warehouse: string;
  type: string;
  email: string;
  token?: string;
}) => {
  store.dispatch(
    loginUser({
      ...userData,
      isLoggedIn: true,
    }),
  );
};

// Helper function to log out a user
export const logoutUserHelper = () => {
  store.dispatch(logoutUser());
};

// Helper function to update user info
export const updateUserInfoHelper = (
  userData: Partial<{
    id: string;
    name: string;
    phone: string;
    warehouse: string;
    type: string;
    email: string;
    token?: string;
  }>,
) => {
  store.dispatch(setUserInfo(userData));
};

// Example usage in a login component:
/*
import { loginUserHelper } from '../store/helpers/authHelpers';

const handleLogin = async (credentials) => {
  try {
    // Make API call to authenticate
    const response = await loginAPI(credentials);
    
    if (response.success) {
      // Login successful - this will automatically persist to AsyncStorage
      loginUserHelper({
        id: response.user.id,
        name: response.user.name,
        phone: response.user.phone,
        warehouse: response.user.warehouse,
        type: response.user.type,
        email: response.user.email,
        token: response.token,
      });
      
      // Navigate to main app
      router.replace('/(drawer)/(tabs)');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
*/
