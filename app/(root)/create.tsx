import { View, Text, Alert, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import axios from 'axios'
import { styles } from '@/styles/create.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'

const CreateScreen = () => {
    const CATEGORIES =[
        {id: "food", name: "Foods & drinks", icon: "fast-food"},
        {id: "shopping", name: "Shopping", icon: "cart"},
        {id: "transportation", name: "Transportation", icon: "car"},
        {id: "entertainment", name: "Entertainment", icon: "film"},
        {id: "bills", name: "Bills", icon: "receipt"},
        {id: "income", name: "Income", icon: "cash"},
        {id: "expenses", name: "Expenses", icon: "cash"},
        {id: "other", name: "Other", icon: "ellipsis-horizontal"}
    ]
    const router = useRouter()
    const {user} = useUser()

    const [title, setTitle] = useState("")
    const [amount, setAmount] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [description, setDescription] = useState("")
    const [isExpense, setIsExpense] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isIncome, setIsIncome] = useState(false)
    const API = process.env.EXPO_PUBLIC_API_URL;

 
    const handleCreate = async () => {
        if (!title.trim()) return Alert.alert("Error", "Please enter a transaction title")
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert("Error", "Please enter a valid amount")
            return;
        }
        if (!selectedCategory) {
            Alert.alert("Error", "Please select a category")
        }
        try {
            setIsLoading(true)
            const formatedAmount = isIncome ? +Math.abs(parseFloat(amount)) : -Math.abs(parseFloat(amount))
            console.log(" Final Amount to Submit====>>>>>>", formatedAmount);

            const response = await axios.post(`${API}/transactions`,{
                userId: user?.id,
                title: title,
                amount: formatedAmount,
                category: isExpense,
                description:selectedCategory,
            })
            if (response.status === 200) {
                const errorData = await response
                throw new Error(errorData.error || "Failed to create transaction")
            }
            Alert.alert("Success", "Transaction created successfully.")
            router.push("/")
        } catch (error) {
            Alert.alert("Error",error?.message || "Failed to create transaction")
            console.error("creating transaction=========error======>>>>>>>>>", error)
        } finally {
            setIsLoading(false)
        }
    }
    console.log("the category========>>>>>>>>", isExpense)
    console.log("Submitting Transaction=======>>>>>>>>>", { title, amount, isIncome, isExpense, selectedCategory})

  return (
        <SafeAreaView style={style.AndroidSafeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={()=> router.back()}>
                        <Ionicons name='arrow-back' size={24} color={COLORS.text}/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Transactions</Text>
                    <TouchableOpacity onPress={handleCreate} disabled={isLoading} style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}>
                        <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
                        {!isLoading && <Ionicons name='checkmark' size={18} color={COLORS.primary}/>}
                    </TouchableOpacity>
                </View>
                <View style={styles.card}>
                    <View style={styles.typeSelector}>
                        <TouchableOpacity style={[styles.typeButton, !isIncome && styles.typeButtonActive]} onPress={() => {setIsExpense("Expenses"); setIsIncome(false); }}>
                            <Ionicons name='arrow-up-circle' size={22} style={styles.typeIcon} color={!isIncome ? COLORS.white : COLORS.expense}/>
                            <Text style={[styles.typeButtonText, !isIncome && styles.typeButtonTextActive]}>Expenses</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.typeButton, isIncome && styles.typeButtonActive]} onPress={()=> {setIsExpense("Income"); setIsIncome(true);}}>
                            <Ionicons name='arrow-down-circle' size={22} style={styles.typeIcon} color={isIncome ? COLORS.white : COLORS.income}/>
                            <Text style={[styles.typeButtonText, isIncome && styles.typeButtonTextActive]}>Income</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencySymbol}>₦</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder='0.00'
                            placeholderTextColor={COLORS.textLight}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name='create-outline' size={22} color={COLORS.textLight} style={styles.inputIcon}/>
                        <TextInput
                            style={styles.input}
                            placeholder='Transaction Title'
                            placeholderTextColor={COLORS.textLight}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                    <Text style={[styles.sectionTitle]}>
                        <View style={{marginTop: 7}}>
                            <Ionicons name='pricetag-outline' size={16} color={COLORS.text}  style={styles.categoryIcon}/>
                        </View>
                        <Text style={{paddingLeft: 30}}>Categories</Text>
                    </Text>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((category)=>(
                            <TouchableOpacity key={category.id}
                              style={[styles.categoryButton, selectedCategory === category.name && styles.categoryButtonActive]}
                              onPress={()=> setSelectedCategory(category.name)}
                            >
                                <Ionicons name={category.icon} size={20} style={styles.categoryIcon} color={selectedCategory === category.name ? COLORS.white : COLORS.primary}/>
                                <Text style={[styles.categoryButtonText, selectedCategory === category.name && styles.categoryButtonTextActive]}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size='large' color={COLORS.primary}/>
                    </View>
                )}
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

export default CreateScreen