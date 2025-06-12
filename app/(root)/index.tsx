import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Platform, StatusBar, Text, View, StyleSheet, SafeAreaView } from 'react-native'
import { SignOutButton } from '@/components/SignoutButton'
import { useTransactions } from '../hooks/useTransactions'
import { useEffect } from 'react'

export default function Page() {
  const { user } = useUser()
  const {transactions, summary, loadData, loading, deleteTransaction} = useTransactions(user.id)

  useEffect(() => {
    loadData();
  }, [loadData]);
console.log('transaactions ========>>>>>>>>', transactions)  
console.log('summary ========>>>>>>>>', summary)  
console.log('user.id ========>>>>>>>>', user.id)  
  return (
    <SafeAreaView style={style.AndroidSafeArea}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        <SignedIn >
          <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
          <SignOutButton />
        </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
    AndroidSafeArea: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});