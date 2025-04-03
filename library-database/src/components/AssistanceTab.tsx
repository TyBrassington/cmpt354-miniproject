"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AssistanceTab: React.FC = () => {
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

  const [volunteerData, setVolunteerData] = useState({
    interestArea: "",
    availability: "",
    message: "",
  })

  const [helpData, setHelpData] = useState({
    topic: "",
    message: "",
    personnelID: "",
  })

  const [personnelList, setPersonnelList] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/get_personnel")
      .then((res) => res.json())
      .then((data) => setPersonnelList(data))
      .catch((err) => console.error("Error fetching personnel:", err))
  }, [])

  const handleVolunteerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolunteerData({ ...volunteerData, [e.target.id]: e.target.value })
  }

  const handleVolunteerSelect = (value: string) => {
    setVolunteerData({ ...volunteerData, interestArea: value })
  }

  const handleHelpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHelpData({ ...helpData, [e.target.id]: e.target.value })
  }

  const handleHelpSelect = (value: string) => {
    setHelpData({ ...helpData, topic: value })
  }
  
  const handleStaffSelect = (value: string) => {
    setHelpData({ ...helpData, personnelID: value })
  }
  

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const sessionResponse = await fetch("http://localhost:5000/check_session", { credentials: "include" })
      const sessionData = await sessionResponse.json()
      if (!sessionData.loggedIn) {
        alert("You must be logged in to submit a volunteer request.")
        return
      }
      const currentPatronID = sessionData.patronID

      const response = await fetch("http://localhost:5000/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patronID: currentPatronID,
          ...volunteerData,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Volunteer request submitted successfully. Request ID: ${data.requestID}`)
        setVolunteerData({ interestArea: "", availability: "", message: "" })
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error submitting volunteer request:", error)
      alert("An error occurred while submitting your volunteer request.")
    }
  }

  const handleHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const sessionResponse = await fetch("http://localhost:5000/check_session", { credentials: "include" })
      const sessionData = await sessionResponse.json()
      if (!sessionData.loggedIn) {
        alert("You must be logged in to ask for help.")
        return
      }
      const currentPatronID = sessionData.patronID

      const response = await fetch("http://localhost:5000/ask_help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patronID: currentPatronID,
          ...helpData,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Help request submitted successfully. Request ID: ${data.requestID}`)
        setHelpData({ topic: "", message: "", personnelID: "" })
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error submitting help request:", error)
      alert("An error occurred while submitting your help request.")
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Volunteer for the Library</CardTitle>
          <CardDescription>Help us serve the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVolunteerSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interestArea">Areas of Interest</Label>
              <Select onValueChange={handleVolunteerSelect} value={volunteerData.interestArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Book Shelving">Book Shelving</SelectItem>
                  <SelectItem value="Event Support">Event Support</SelectItem>
                  <SelectItem value="Technology Assistance">Technology Assistance</SelectItem>
                  <SelectItem value="Children's Programs">Children's Programs</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                value={volunteerData.availability}
                onChange={handleVolunteerChange}
                placeholder="e.g., Weekends, Evenings"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Message (optional)</Label>
              <Input
                id="message"
                value={volunteerData.message}
                onChange={handleVolunteerChange}
              />
            </div>
            <Button type="submit" className="w-full">Submit Application</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ask for Help</CardTitle>
          <CardDescription>Get assistance from our staff</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleHelpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Type of Assistance</Label>
              <Select onValueChange={handleHelpSelect} value={helpData.topic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology Support">Technology Support</SelectItem>
                  <SelectItem value="Account Issues">Account Issues</SelectItem>
                  <SelectItem value="Library Card Issue">Library Card Issue</SelectItem>
                  <SelectItem value="Book Suggestion">Book Suggestion</SelectItem>
                  <SelectItem value="Research Help">Research Help</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Question</Label>
              <Input
                id="message"
                placeholder="Enter your query"
                value={helpData.message}
                onChange={handleHelpChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Select a Staff Member to help you</Label>
              <Select onValueChange={handleStaffSelect} value={helpData.personnelID}>
                <SelectTrigger>
                  <SelectValue placeholder="(optional) Select staff" />
                </SelectTrigger>
                <SelectContent>
                  {personnelList.map((person) => (
                    <SelectItem key={person.personnelID} value={person.personnelID}>
                      {person.firstName} {person.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AssistanceTab
