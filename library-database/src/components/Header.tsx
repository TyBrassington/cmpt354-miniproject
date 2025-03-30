"use client"

import React from "react"
import { Button } from "@/components/ui/button"

const Header: React.FC = () => {
  return (
    <header className="p-4 bg-primary text-primary-foreground">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Library Database Application</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Login</Button>
          <Button variant="secondary" size="sm">Sign Up</Button>
        </div>
      </div>
    </header>
  )
}

export default Header
