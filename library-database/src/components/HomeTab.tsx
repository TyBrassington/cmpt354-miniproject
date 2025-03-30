"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Event = {
  id: string
  title: string
  date: string
  time: string
  location: string
}

interface HomeTabProps {
  setActiveTab: (value: string) => void
  upcomingEvents: Event[]
}

const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab, upcomingEvents }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Library</CardTitle>
          <CardDescription>Your gateway to knowledge and discovery</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the tabs above to navigate through the various operations. You can search for items, borrow or return
            materials, register for events, and request assistance.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setActiveTab("items")}>Browse Collection</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Join us for these exciting activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border-b pb-2">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {event.date} at {event.time}
                </p>
                <p className="text-sm text-muted-foreground">Location: {event.location}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setActiveTab("events")}>View All Events</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default HomeTab
