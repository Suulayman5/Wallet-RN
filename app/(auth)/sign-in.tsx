import { useSignIn } from '@clerk/clerk-expo'
import { Link, useNavigation, useRouter } from 'expo-router'
import { Platform, StatusBar, Text, TextInput, TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '@/styles/auth.styles'
import { COLORS } from '@/constants/colors'
import {Image} from 'expo-image'
export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
    const [error, setError] = useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if (err.errors?.[0]?.code === 'clerk_email_address_not_found') {
        setError('Email address not found. Please sign up first.')
        
      }else if (err.errors?.[0]?.code === 'form_password_incorrect') {
        setError('Invalid password. Please try again.')
      }else {
        setError('An unexpected error occurred. Please try again later.')
        console.error(JSON.stringify(err, null, 2))
      }
    }
  }

  return (
    <SafeAreaView style={style.AndroidSafeArea}>
      <KeyboardAwareScrollView 
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image source={require('../../assets/images/revenue-i4.png')} style={styles.illustration}/>
          <Text style={styles.title}>Welcome back</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError('')}>
                <Ionicons name="close" size={20} color={COLORS.textLight}/>
              </TouchableOpacity>
            </View>
          ): null}
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            placeholderTextColor="#9A8478"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#9A8478"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity onPress={onSignInPress} style={styles.button}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={()=> router.push('/(auth)/sign-up')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
    AndroidSafeArea: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
});