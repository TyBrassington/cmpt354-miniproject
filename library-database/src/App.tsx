"use client"

import React, { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import our new components
import Header from "@/components/Header"
import HomeTab from "@/components/HomeTab"
import ItemsTab from "@/components/ItemsTab"
import TransactionsTab from "@/components/TransactionsTab"
import EventsTab from "@/components/EventsTab"
import AssistanceTab from "@/components/AssistanceTab"

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home")

  // Static data – you can also move this to its own module if needed.
  const libraryItems = [
    { id: "B001", title: "The Great Gatsby", type: "Book", genre: "Fiction", status: "Available" },
    { id: "B002", title: "To Kill a Mockingbird", type: "Book", genre: "Fiction", status: "Borrowed" },
    { id: "D001", title: "Planet Earth", type: "DVD", genre: "Documentary", status: "Available" },
    { id: "M001", title: "Introduction to Python", type: "Magazine", genre: "Technology", status: "Available" },
  ]

  const upcomingEvents = [
    { id: "E001", title: "Book Club Meeting", date: "April 15, 2025", time: "6:00 PM", location: "Main Hall" },
    { id: "E002", title: "Children's Story Time", date: "April 10, 2025", time: "10:00 AM", location: "Children's Section" },
    { id: "E003", title: "Author Meet & Greet", date: "April 22, 2025", time: "7:00 PM", location: "Conference Room" },
  ]

  return (
    <ThemeProvider defaultTheme="system" storageKey="library-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">Home</TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-2">Items</TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">Borrow/Return</TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">Events</TabsTrigger>
              <TabsTrigger value="assistance" className="flex items-center gap-2">Assistance</TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <HomeTab setActiveTab={setActiveTab} upcomingEvents={upcomingEvents.slice(0, 2)} />
            </TabsContent>

            <TabsContent value="items">
              <ItemsTab libraryItems={libraryItems} />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionsTab />
            </TabsContent>

            <TabsContent value="events">
              <EventsTab upcomingEvents={upcomingEvents} />
            </TabsContent>

            <TabsContent value="assistance">
              <AssistanceTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
