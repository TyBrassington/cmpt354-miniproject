"use client"

import React, { useState, useEffect } from "react"
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

const ItemsTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [donateItem, setDonateItem] = useState({
    title: "",
    type: "",
    genre: "",
    authorArtist: "",
    publisher: "",
    publicationDate: "",
    isbnIssn: ""
  })
  const [libraryItemsData, setLibraryItemsData] = useState<LibraryItem[]>([])

  const fetchItems = async (keyword: string = "") => {
    try {
      const response = await fetch(
        `http://localhost:5000/find_item?keyword=${encodeURIComponent(keyword)}`
      )
      if (response.ok) {
        const data = await response.json()
        setLibraryItemsData(data)
      } else {
        console.error("Search failed with status:", response.status)
      }
    } catch (error) {
      console.error("Error during search:", error)
    }
  }

  useEffect(() => {
    fetchItems("")
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    fetchItems(searchQuery)
  }

const handleDonateSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const response = await fetch("http://localhost:5000/donate_item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: donateItem.title,
        type: donateItem.type,
        genre: donateItem.genre,
        authorArtist: donateItem.authorArtist,
        publisher: donateItem.publisher,
        publicationDate: donateItem.publicationDate,
        isbnIssn: donateItem.isbnIssn,
      }),
    })
    const result = await response.json()
    if (response.ok) {
      alert(`Donation successful: ${result.message}`)
      fetchItems("")
    } else {
      alert(`Donation failed: ${result.error}`)
    }
    setDonateItem({
      title: "",
      type: "",
      genre: "",
      authorArtist: "",
      publisher: "",
      publicationDate: "",
      isbnIssn: ""
    })
  } catch (error) {
    console.error("Error during donation:", error)
    alert("An error occurred during donation.")
  }
}


  return (
    <div className="space-y-6">
      {/* Top row: Find an Item and Donate an Item */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Find an Item</CardTitle>
            <CardDescription>Search our collection</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch}>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="search">Search by title or genre</Label>
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
            </form>
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorArtist">Author/Artist</Label>
                <Input
                  id="authorArtist"
                  value={donateItem.authorArtist}
                  onChange={(e) => setDonateItem({ ...donateItem, authorArtist: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  value={donateItem.publisher}
                  onChange={(e) => setDonateItem({ ...donateItem, publisher: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationDate">Publication Date</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  value={donateItem.publicationDate}
                  onChange={(e) => setDonateItem({ ...donateItem, publicationDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbnIssn">ISBN/ISSN</Label>
                <Input
                  id="isbnIssn"
                  value={donateItem.isbnIssn}
                  onChange={(e) => setDonateItem({ ...donateItem, isbnIssn: e.target.value })}
                  required
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
                {libraryItemsData.map((item) => (
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
