"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type LibraryItem = {
  itemID: string
  title: string
  type: string
  genre: string
  authorArtist: string
  publisher: string
  publicationDate: string
  isbnIssn: string
  availabilityStatus: string
}

interface ItemsTabProps {
  libraryItems: LibraryItem[]
}

const ItemsTab: React.FC<ItemsTabProps> = ({ libraryItems }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [donateItem, setDonateItem] = useState({ title: "", type: "", genre: "" })

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Item "${donateItem.title}" has been added to donation queue!`)
    setDonateItem({ title: "", type: "", genre: "" })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Select value={donateItem.type} onValueChange={(value) => setDonateItem({ ...donateItem, type: value })}>
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
              <Button type="submit" className="w-full">Donate</Button>
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
                  <TableHead>Item ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Author/Artist</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Publication Date</TableHead>
                  <TableHead>ISBN/ISSN</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {libraryItems.map((item) => (
                  <TableRow key={item.itemID}>
                    <TableCell>{item.itemID}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.genre}</TableCell>
                    <TableCell>{item.authorArtist}</TableCell>
                    <TableCell>{item.publisher}</TableCell>
                    <TableCell>{item.publicationDate}</TableCell>
                    <TableCell>{item.isbnIssn}</TableCell>
                    <TableCell>
                      <Badge variant={item.availabilityStatus === "Available" ? "default" : "secondary"}>
                        {item.availabilityStatus}
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
  )
}

export default ItemsTab
