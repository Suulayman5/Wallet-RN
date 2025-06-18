import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Platform, StatusBar, Text, View, StyleSheet, SafeAreaView, Image, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native'
import { SignOutButton } from '@/components/SignoutButton'
import { useTransactions } from '../hooks/useTransactions'
import { useEffect, useState } from 'react'
import PageLoader from '@/components/PageLoader'
import { styles } from '@/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import BalanceCart from '@/components/BalanceCart'
import TransactionItem from '@/components/TransactionItem'
import NoTransactionFound from '@/components/NoTrasactionFound'

export default function Page() {
  const { user } = useUser()
  const { transactions, summary, loadData, loading, deleteTransaction } = useTransactions(user?.id)
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)

  }

  useEffect(() => {
    if (user?.id) {
      loadData(user.id)
    }
  }, [user?.id])

  const handleDelete = (id: string) =>{
       Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
        {text: "Cancel", style:"cancel"},
        {text: "Delete", style:"destructive", onPress: () => deleteTransaction(id)}
       ])
  }
  console.log("transactions=======>>>>>>>>", transactions);


  if (loading && !refreshing) return <PageLoader />

  return (
    <SafeAreaView style={style.AndroidSafeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode='contain'/>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={styles.usernameText}>{user?.username || user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                <Ionicons name='add' size={20} color="white"/>
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
              <SignOutButton />
            </View>
          </View>
          {/* <BalanceCart summary={summary}/> */}
          <BalanceCart summary={{
            income: summary?.summary?.income,
            expense: summary?.summary?.expenses,
            balance: summary?.summary?.total
          }} />
          <View style={styles.transactionsHeaderContainer}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </View>

        </View>
        <FlatList
          style={styles.transactionsList}
          contentContainerStyle={styles.transactionsListContent}
          data={transactions.items}
            keyExtractor={(item) => item.id}
          renderItem={({item})=>
            <TransactionItem item={item} onDelete={handleDelete}/>
          }
          ListEmptyComponent={<NoTransactionFound/>}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
          
        />
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
