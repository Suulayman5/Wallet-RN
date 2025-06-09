import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '@/constants/colors'

type IProps = {
    children: React.ReactNode
}
const SafeScreen = ({children}:IProps) => {
    const insets = useSafeAreaInsets()

  return (
    <View style={{paddingTop: insets.top, flex: 1, backgroundColor: COLORS.background}}>
        {children}
    </View>
  )
}

export default SafeScreen