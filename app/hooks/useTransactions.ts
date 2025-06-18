import { useCallback, useState } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { useAuth } from '@clerk/clerk-expo';


const API = process.env.EXPO_PUBLIC_API_URL;
export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [loading, setLoading] = useState(false);
  const fetchTransactions = useCallback(async () =>{
    try {
const response = await axios.get(`${API}/transactions/${userId}`);
        const data = response.data;
        setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
        
    }
    }, [userId]);

  const fetchSummary = useCallback(async () =>{
    try {
      const response = await axios.get(`${API}/transactions/summary/${userId}`);
        const data = response.data;
        setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
        
    }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) {
            console.warn("User ID is required to load transactions and summary.");
            return;
        }
        setLoading(true);
        try {
            await Promise.all([ fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:", error);
            
        } finally {
            setLoading(false);
        }
    }, [userId, fetchTransactions, fetchSummary]);

    const deleteTransaction = async (id: string) => {
        try {
          console.log("the id of the deleted item=======>>>>>>>>>", id)
          await axios.delete(`${API}/transactions/${id}`);
          loadData(); // Refresh data after deletion
          Alert.alert("Success", "Transaction deleted successfully.");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", "Failed to delete transaction. Please try again.");
        }
    }
    return {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransaction,
    };
}