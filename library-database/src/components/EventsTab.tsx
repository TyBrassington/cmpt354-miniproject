"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays } from "lucide-react"

type Event = {
  id: string
  title: string
  date: string
  time: string
  location: string
}

interface EventsTabProps {
  upcomingEvents: Event[]
}

const EventsTab: React.FC<EventsTabProps> = ({ upcomingEvents }) => {
  return (
    <div className="grid md:grid-cols-[2fr_1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Join us for these exciting activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-center bg-muted rounded-lg p-4 md:w-24 md:h-24">
                  <CalendarDays className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.date} at {event.time}
                  </p>
                  <p className="text-sm text-muted-foreground">Location: {event.location}</p>
                  <div className="mt-2">
                    <Button size="sm" variant="outline">Register</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Register for an Event</CardTitle>
          <CardDescription>Sign up for library events</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patronId">Patron ID</Label>
              <Input id="patronId" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventId">Event</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {upcomingEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} - {event.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Number of Attendees</Label>
              <Input id="attendees" type="number" min="1" defaultValue="1" />
            </div>

            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EventsTab
