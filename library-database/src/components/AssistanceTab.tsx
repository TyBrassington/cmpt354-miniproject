"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AssistanceTab: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Volunteer for the Library</CardTitle>
          <CardDescription>Help us serve the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Areas of Interest</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shelving">Book Shelving</SelectItem>
                  <SelectItem value="events">Event Support</SelectItem>
                  <SelectItem value="tech">Technology Assistance</SelectItem>
                  <SelectItem value="children">Children's Programs</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="helpType">Type of Assistance</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">Research Help</SelectItem>
                  <SelectItem value="tech">Technology Support</SelectItem>
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="query">Your Question</Label>
              <Input id="query" placeholder="Enter your query" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactMethod">Preferred Contact Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="inPerson">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information</Label>
              <Input id="contactInfo" required />
            </div>

            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AssistanceTab
