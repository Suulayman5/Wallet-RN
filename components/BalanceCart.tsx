import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '@/styles/home.styles'
import { COLORS } from '@/constants/colors'

interface IProp {
    summary?: {
        balance?: number | string;
        income?: number | string;
        expense?: number | string;
    };
}

const DEFAULT_SUMMARY = {
    balance: 0,
    income: 0,
    expense: 0
};

const BalanceCart = ({ summary = DEFAULT_SUMMARY }: IProp) => {
    // Safely get values with defaults
    const { balance = 0, income = 0, expense = 0 } = summary || {};

    // Helper function to safely parse and format values
    const formatCurrency = (value: number | string | undefined) => {
        const num = typeof value === 'string' ? parseFloat(value) : Number(value || 0);
        return `₦ ${num.toFixed(2)}`;
    };
    console.log('sumary====>>>>>>>>', summary)
    return (
        <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <Text style={styles.balanceAmount}>
                {formatCurrency(balance)}
            </Text>
            
            <View style={styles.balanceStats}>
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Income</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
                        +{formatCurrency(income)}
                    </Text>
                </View>
                
                <View style={[styles.balanceStatItem, styles.statDivider]} />
                
                <View style={styles.balanceStatItem}>
                    <Text style={styles.balanceStatLabel}>Expenses</Text>
                    <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
                        -{formatCurrency(Math.abs(Number(expense)))}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default BalanceCart