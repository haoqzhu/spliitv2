import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // 👈 disables swipe back
        animation: 'fade_from_bottom',
      }}
    />
  )
}
