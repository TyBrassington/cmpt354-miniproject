"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"

type BorrowForm = {
  patronId: string
  itemId: string
  borrowDate: Date | undefined
  dueDate: Date | undefined
}

type ReturnForm = {
  transactionId: string
  returnDate: Date | undefined
}

const TransactionsTab: React.FC = () => {
  const [borrowForm, setBorrowForm] = useState<BorrowForm>({
    patronId: "",
    itemId: "",
    borrowDate: undefined,
    dueDate: undefined,
  })

  const [returnForm, setReturnForm] = useState<ReturnForm>({
    transactionId: "",
    returnDate: undefined,
  })

  const handleBorrowSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Borrow request submitted for Patron ID: ${borrowForm.patronId}, Item ID: ${borrowForm.itemId}`)
    setBorrowForm({ patronId: "", itemId: "", borrowDate: undefined, dueDate: undefined })
  }

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Return request submitted for Transaction ID: ${returnForm.transactionId}`)
    setReturnForm({ transactionId: "", returnDate: undefined })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Borrow an Item</CardTitle>
          <CardDescription>Check out library materials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBorrowSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patronId">Patron ID</Label>
              <Input
                id="patronId"
                value={borrowForm.patronId}
                onChange={(e) => setBorrowForm({ ...borrowForm, patronId: e.target.value })}
                required
              />
            </div>

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
  )
}

export default TransactionsTab
