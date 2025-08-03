import React, { useEffect, useState } from 'react'

import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Stack, useRouter, useSegments } from 'expo-router';

const AuthLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { loggedIn } = useGlobalContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || segments?.length === 0) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!loggedIn && !inAuthGroup) {
      // User is NOT logged in and NOT on auth pages
      router.replace('/(auth)/sign-in');
    } else if (loggedIn && inAuthGroup) {
      // User IS logged in but still on auth pages
      router.replace('/(drawer)/(tabs)');
    }
  }, [loggedIn, segments, isMounted]);


  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <Loader isLoading={false} />
    </>
  );
}

export default AuthLayout