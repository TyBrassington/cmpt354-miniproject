"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Event = {
  id: string
  title: string
  date: string
  time: string
  location: string
  recommendedAudience: string
  attendeeCount: number
}

const EventsTab: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/check_session", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.loggedIn) {
          console.log("User is logged in with Patron ID:", data.patronID)
        }
      })
      .catch((error) => console.error("Error checking session:", error))
  }, [])

  const fetchEvents = async (keyword = "") => {
    try {
      const response = await fetch(
        `http://localhost:5000/find_event?keyword=${encodeURIComponent(keyword)}`,
        { credentials: "include" }
      )
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        console.error("Failed to fetch events")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  useEffect(() => {
    fetchEvents("")
  }, [])

  const handleRegister = async (eventID: string) => {
    try {
      const sessionResponse = await fetch("http://localhost:5000/check_session", { credentials: "include" })
      const sessionData = await sessionResponse.json()
      if (!sessionData.loggedIn) {
        alert("Please login to register for events.")
        return
      }
      const currentPatronID = sessionData.patronID

      const response = await fetch("http://localhost:5000/register_event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patronID: currentPatronID,
          eventID,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Successfully registered! Attendance ID: ${data.attendanceID}`)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error registering for event:", error)
      alert("An error occurred during event registration.")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Join us for these exciting activities</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              fetchEvents(searchQuery)
            }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <Label htmlFor="eventSearch" className="sr-only">
              Search Events
            </Label>
            <Input
              id="eventSearch"
              type="text"
              placeholder="Search events by name or audience"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                fetchEvents("")
              }}
            >
              Reset
            </Button>
          </form>
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center bg-muted rounded-lg p-4 md:w-24 md:h-24">
                  <CalendarDays className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.date} at {event.time}
                  </p>
                  <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                  <p className="text-sm text-muted-foreground">
                    Recommended Audience: {event.recommendedAudience}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Registered Attendees: {event.attendeeCount}
                  </p>
                </div>
                <div className="flex items-center">
                  <Button size="sm" variant="outline" onClick={() => handleRegister(event.id)}>
                    Register
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EventsTab
