import { ReactNode, useEffect, useState, useCallback } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

interface Trasanctions {
  id: number,
  description: string,
  type: 'income' | 'outcome',
  price: number,
  category: string,
  createdAt: string
}

interface CreateTransactionInput {
  description: string,
  price: number,
  category: string,
  type: 'income' | 'outcome'
}

interface TransactionContextType {
  transactions: Trasanctions[],
  fetchtrabsactions: (query?: string) => Promise<void>
  createTransactions: (data: CreateTransactionInput) => Promise<void>
}


export const TransactionContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: { children: ReactNode }) {

  const [transactions, setTransactions] = useState<Trasanctions[]>([]);

  const fetchtrabsactions = useCallback(async (query?: string) => {

    const { data } = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query
      }
    })
    setTransactions(data)
  }, [])



  const createTransactions = useCallback(async (data: CreateTransactionInput) => {

    const { description, price, category, type } = data;

    const response = await api.post('transactions', {
      description,
      price,
      category,
      type,
      createdAt: new Date()
    })
    setTransactions(state => [...state, response.data])
  }, [])

  useEffect(() => {
    fetchtrabsactions();
  }, [])

  return (
    <TransactionContext.Provider value={{ transactions, fetchtrabsactions, createTransactions }}>
      {children}
    </TransactionContext.Provider>
  )
}