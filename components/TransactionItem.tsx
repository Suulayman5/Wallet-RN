import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from '@/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { formatDate } from '@/lib/utils'

const CATEGORY_ICONS ={
    "foods & drinks": "fast-food",
    Shopping: "cart",
    Transportation: "car",
    Entertainment: "film",
    Bills: "receipt",
    Income: "cash",
    Other: "ellipsis-horizantal"
}

interface Iprop {
    item: {
        amount: string
        category: string 
        title: string
        date: number
        id: string
        description: string
    },
    onDelete: (id: string)=> void
}

const TransactionItem = ({item, onDelete}: Iprop) => {
    const isIncome = item.category === 'income'
    const iconName = CATEGORY_ICONS[item.description] || "pricetag-outline"
    // if (item.description + iconName ) {
        
    // }
  return (
    <View style={styles.transactionCard} key={item.id}>
        <TouchableOpacity style={styles.transactionContent}>
            <View style={styles.categoryIconContainer}>
                <Ionicons name={iconName} size={22} color={isIncome ? COLORS.income : COLORS.expense}/>
            </View>
            <View style={styles.transactionLeft}>
                <Text style={styles.transactionTitle}>{item.description}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
            </View>
            <View style={styles.transactionRight}>
                <Text style={[styles.transactionAmount, {color: isIncome ? COLORS.income : COLORS.expense}]}>
                    {isIncome?" + " : " - "}₦ {Math.abs(parseFloat(item.amount)).toFixed(2)}
                </Text>
                <Text>{formatDate(item.date)}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={()=>onDelete(item.id)}>
            <Ionicons name='trash-outline' size={20} color={COLORS.expense}/>
        </TouchableOpacity>
    </View>
  )
}

export default TransactionItem