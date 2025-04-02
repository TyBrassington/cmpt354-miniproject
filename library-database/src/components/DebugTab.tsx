"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const DebugTab: React.FC = () => {
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [tableData, setTableData] = useState<any[]>([])
  const [tableColumns, setTableColumns] = useState<string[]>([])

  const fetchTables = async () => {
    try {
      const response = await fetch("http://localhost:5000/debug_tables", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setTables(data)
        if (data.length > 0 && !selectedTable) {
          setSelectedTable(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching tables:", error)
    }
  }

  const fetchTableData = async (table: string) => {
    try {
      const response = await fetch(`http://localhost:5000/debug_table_data?table=${table}`, { credentials: "include" })
      if (response.ok) {
        const json = await response.json()
        setTableColumns(json.columns)
        setTableData(json.data)
      }
    } catch (error) {
      console.error("Error fetching table data:", error)
    }
  }

  useEffect(() => {
    fetchTables()
  }, [])

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable)
    }
  }, [selectedTable])

  useEffect(() => {
    const handleDebugTabActive = () => {
      fetchTables().then(() => {
        if (selectedTable) {
          fetchTableData(selectedTable)
        }
      })
    }
    window.addEventListener("debugTabActive", handleDebugTabActive)
    return () => {
      window.removeEventListener("debugTabActive", handleDebugTabActive)
    }
  }, [selectedTable])

  const handleRefresh = () => {
    if (selectedTable) {
      fetchTableData(selectedTable)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug: Database Tables</CardTitle>
        <CardDescription>View the contents of database tables</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Label>Choose Table:</Label>
          <Select onValueChange={(value) => setSelectedTable(value)} value={selectedTable}>
            <SelectTrigger>
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table} value={table}>
                  {table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>Refresh</Button>
        </div>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.length > 0 ? (
                  tableColumns.map((col) => (
                    <TableHead key={col}>{col}</TableHead>
                  ))
                ) : (
                  <TableHead>No Data</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  {tableColumns.map((col) => (
                    <TableCell key={col}>{String(row[col])}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default DebugTab
