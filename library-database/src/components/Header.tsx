"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Header: React.FC = () => {
  const [patronID, setPatronID] = useState<string | null>(null)

  const [loginOpen, setLoginOpen] = useState(false)
  const [loginInput, setLoginInput] = useState("")

  const [signupOpen, setSignupOpen] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [contact, setContact] = useState("")
  const [email, setEmail] = useState("")

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...(loginInput.includes("@")
            ? { email: loginInput }
            : { patronID: loginInput }),
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Login successful! Your Patron ID is ${data.patronID}`)
        setPatronID(data.patronID)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setLoginOpen(false)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error(error)
      alert("Login failed")
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          contact,
          email,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert(`Registration successful! Your Patron ID is ${data.patronID}`)
        setPatronID(data.patronID)
        setSignupOpen(false)
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error(error)
      alert("Registration failed")
    }
  }

  const handleLogout = () => {
    setPatronID(null)
    alert("Logged out")
  }

  return (
    <header className="p-4 bg-primary text-primary-foreground">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Library Database Application</h1>
        <div className="flex items-center gap-2">
          {patronID ? (
            <>
              <span className="text-sm">Logged in as: {firstName} {lastName}</span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">Login</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>
                      Enter your Patron ID or Email to login.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loginInput">Patron ID or Email</Label>
                      <Input
                        id="loginInput"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">Sign Up</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sign Up</DialogTitle>
                    <DialogDescription>
                      Fill in your details to register.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Info</Label>
                      <Input
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">Register</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
