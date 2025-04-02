"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
}

const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab }) => {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/find_event", {
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          const simplified = data.map((event: any) => ({
            id: event.id,
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
          }))
          setEvents(simplified.slice(0, 2))
        } else {
          console.error("Failed to fetch events")
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [])

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
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events.</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="border-b pb-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.date} at {event.time}
                  </p>
                  <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setActiveTab("events")}>
            View All Events
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default HomeTab
