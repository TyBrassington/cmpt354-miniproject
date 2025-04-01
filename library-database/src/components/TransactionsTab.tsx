"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"

type BorrowForm = {
  itemId: string
  borrowDate: Date | undefined
  dueDate: Date | undefined
}

type ReturnForm = {
  transactionId: string
  returnDate: Date | undefined
}

type Transaction = {
  transactionID: string
  patronID: string
  itemID: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
  fineAmount: number
}

const TransactionsTab: React.FC = () => {
  const today = new Date()

  const [borrowForm, setBorrowForm] = useState<BorrowForm>({
    itemId: "",
    borrowDate: today,
    dueDate: undefined,
  })

  const [returnForm, setReturnForm] = useState<ReturnForm>({
    transactionId: "",
    returnDate: today,
  })

  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_transactions", {
        method: "GET",
        credentials: "include"
      })
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      } else {
        console.error("Failed to fetch transactions")
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  useEffect(() => {
    fetchTransactions()
    const handleTransactionsUpdated = () => {
      fetchTransactions()
    }
    window.addEventListener("transactionsUpdated", handleTransactionsUpdated)
    return () => {
      window.removeEventListener("transactionsUpdated", handleTransactionsUpdated)
    }
  }, [])

  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/borrow_item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          itemId: borrowForm.itemId,
          borrowDate: borrowForm.borrowDate,
          dueDate: borrowForm.dueDate,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Borrow successful! Transaction ID: ${data.transactionId}`)
        window.dispatchEvent(new Event("transactionsUpdated"))
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error borrowing item:", error)
      alert("An error occurred while borrowing the item.")
    }
    setBorrowForm({ itemId: "", borrowDate: today, dueDate: undefined })
  }

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/return_item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          transactionId: returnForm.transactionId,
          returnDate: returnForm.returnDate,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert("Return successful!")
        window.dispatchEvent(new Event("transactionsUpdated"))
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error returning item:", error)
      alert("An error occurred while returning the item.")
    }
    setReturnForm({ transactionId: "", returnDate: today })
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Borrow an Item</CardTitle>
            <CardDescription>Check out library materials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBorrowSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemId">Item ID</Label>
                <Input
                  id="itemId"
                  value={borrowForm.itemId}
                  onChange={(e) => setBorrowForm({ ...borrowForm, itemId: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Borrow Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {borrowForm.borrowDate ? format(borrowForm.borrowDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={borrowForm.borrowDate}
                      onSelect={(date) => setBorrowForm({ ...borrowForm, borrowDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {borrowForm.dueDate ? format(borrowForm.dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={borrowForm.dueDate}
                      onSelect={(date) => setBorrowForm({ ...borrowForm, dueDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full">Borrow</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Return an Item</CardTitle>
            <CardDescription>Process returned materials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={returnForm.transactionId}
                  onChange={(e) => setReturnForm({ ...returnForm, transactionId: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnForm.returnDate ? format(returnForm.returnDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnForm.returnDate}
                      onSelect={(date) => setReturnForm({ ...returnForm, returnDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full">Return</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Active Transactions</CardTitle>
          <CardDescription>All your current open transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Transaction ID</th>
                  <th className="p-2 text-left">Item ID</th>
                  <th className="p-2 text-left">Borrow Date</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Return Date</th>
                  <th className="p-2 text-left">Fine</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.transactionID} className="border-b">
                    <td className="p-2">{tx.transactionID}</td>
                    <td className="p-2">{tx.itemID}</td>
                    <td className="p-2">{tx.borrowDate ? format(new Date(tx.borrowDate), "PPP") : "-"}</td>
                    <td className="p-2">{tx.dueDate ? format(new Date(tx.dueDate), "PPP") : "-"}</td>
                    <td className="p-2">{tx.returnDate ? format(new Date(tx.returnDate), "PPP") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionsTab
