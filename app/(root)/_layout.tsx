import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack'

export default function Layout() {
    const {isSignedIn} = useAuth();

    if (!isSignedIn) {
        <Redirect href={"/(auth)/sign-in"}/>
    }
  return <Stack />
}