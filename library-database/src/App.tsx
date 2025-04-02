"use client"

import React, { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Header from "@/components/Header"
import HomeTab from "@/components/HomeTab"
import ItemsTab from "@/components/ItemsTab"
import TransactionsTab from "@/components/TransactionsTab"
import EventsTab from "@/components/EventsTab"
import AssistanceTab from "@/components/AssistanceTab"
import DebugTab from "@/components/DebugTab"

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "debug") {
      window.dispatchEvent(new Event("debugTabActive"))
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="library-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto p-4">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">Home</TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-2">Items</TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">Borrow/Return</TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">Events</TabsTrigger>
              <TabsTrigger value="assistance" className="flex items-center gap-2">Assistance</TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center gap-2">Debug</TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <HomeTab setActiveTab={setActiveTab} />
            </TabsContent>

            <TabsContent value="items">
              <ItemsTab />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionsTab />
            </TabsContent>

            <TabsContent value="events">
              <EventsTab />
            </TabsContent>

            <TabsContent value="assistance">
              <AssistanceTab />
            </TabsContent>
            
            <TabsContent value="debug">
              <DebugTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
