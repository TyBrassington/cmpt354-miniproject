"use client"

import type React from "react"
import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search, BookOpen, Users, CalendarDays, HelpCircle } from "lucide-react"

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home")

  // Form states
  const [searchQuery, setSearchQuery] = useState("")
  const [donateItem, setDonateItem] = useState({ title: "", type: "", genre: "" })
  type BorrowForm = {
      patronId: string
      itemId: string
      borrowDate: Date | undefined
      dueDate: Date | undefined
  }

  const [borrowForm, setBorrowForm] = useState<BorrowForm>({
      patronId: "",
      itemId: "",
      borrowDate: undefined,
      dueDate: undefined,
  })
  type ReturnForm = {
    transactionId: string
    returnDate: Date | undefined
  }

  const [returnForm, setReturnForm] = useState<ReturnForm>({
    transactionId: "",
    returnDate: undefined,
  })

  // Mock data
  const libraryItems = [
    { id: "B001", title: "The Great Gatsby", type: "Book", genre: "Fiction", status: "Available" },
    { id: "B002", title: "To Kill a Mockingbird", type: "Book", genre: "Fiction", status: "Borrowed" },
    { id: "D001", title: "Planet Earth", type: "DVD", genre: "Documentary", status: "Available" },
    { id: "M001", title: "Introduction to Python", type: "Magazine", genre: "Technology", status: "Available" },
  ]

  const upcomingEvents = [
    { id: "E001", title: "Book Club Meeting", date: "April 15, 2025", time: "6:00 PM", location: "Main Hall" },
    {
      id: "E002",
      title: "Children's Story Time",
      date: "April 10, 2025",
      time: "10:00 AM",
      location: "Children's Section",
    },
    { id: "E003", title: "Author Meet & Greet", date: "April 22, 2025", time: "7:00 PM", location: "Conference Room" },
  ]

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Item "${donateItem.title}" has been added to donation queue!`)
    setDonateItem({ title: "", type: "", genre: "" })
  }

  const handleBorrowSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Borrow request submitted for Patron ID: ${borrowForm.patronId}, Item ID: ${borrowForm.itemId}`)
    setBorrowForm({ patronId: "", itemId: "", borrowDate: undefined, dueDate: undefined })
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="library-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="p-4 bg-primary text-primary-foreground">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Library Database Application</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button variant="secondary" size="sm">
                Sign Up
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden md:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger value="items" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Items</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Borrow/Return</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden md:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger value="assistance" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden md:inline">Assistance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome to the Library</CardTitle>
                    <CardDescription>Your gateway to knowledge and discovery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Use the tabs above to navigate through the various operations. You can search for items, borrow or
                      return materials, register for events, and request assistance.
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
                      {upcomingEvents.slice(0, 2).map((event) => (
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
                    <Button variant="outline" onClick={() => setActiveTab("events")}>
                      View All Events
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="items">
              <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Find an Item</CardTitle>
                      <CardDescription>Search our collection</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="search">Search by title, author, or keyword</Label>
                        <div className="flex gap-2">
                          <Input
                            id="search"
                            type="text"
                            placeholder="Enter search terms"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <Button type="submit">Search</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Donate an Item</CardTitle>
                      <CardDescription>Contribute to our collection</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleDonateSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Item Title</Label>
                          <Input
                            id="title"
                            value={donateItem.title}
                            onChange={(e) => setDonateItem({ ...donateItem, title: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="type">Item Type</Label>
                          <Select
                            value={donateItem.type}
                            onValueChange={(value) => setDonateItem({ ...donateItem, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Book">Book</SelectItem>
                              <SelectItem value="DVD">DVD</SelectItem>
                              <SelectItem value="Magazine">Magazine</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="genre">Genre</Label>
                          <Input
                            id="genre"
                            value={donateItem.genre}
                            onChange={(e) => setDonateItem({ ...donateItem, genre: e.target.value })}
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          Donate
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Library Collection</CardTitle>
                    <CardDescription>Browse our available items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Genre</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {libraryItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.title}</TableCell>
                              <TableCell>{item.type}</TableCell>
                              <TableCell>{item.genre}</TableCell>
                              <TableCell>
                                <Badge variant={item.status === "Available" ? "default" : "secondary"}>
                                  {item.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
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

                      <Button type="submit" className="w-full">
                        Borrow
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Return an Item</CardTitle>
                    <CardDescription>Process returned materials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
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

                      <Button type="submit" className="w-full">
                        Return
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events">
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
                              <Button size="sm" variant="outline">
                                Register
                              </Button>
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

                      <Button type="submit" className="w-full">
                        Register
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assistance">
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

                      <Button type="submit" className="w-full">
                        Submit Application
                      </Button>
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

                      <Button type="submit" className="w-full">
                        Submit Request
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App

