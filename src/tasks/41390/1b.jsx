import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data
const sampleData = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    product_name: "Wireless Mouse",
    product_id: "prod_001",
    total_price: 59.98,
    unit_price: 29.99,
    quantity: 2,
    phone_number: "+14155552671",
    registration_date: "2024-01-15T14:30:00Z",
    status: "active",
    address: "123 Main St, Springfield",
    payment_status: "completed",
    delivery_status: "delivered",
    region: "North America",
    sales_channel: "online",
    discount_applied: 10.0,
  },
  // ... (19 more sample records)
];

export default function App() {
  const [data, setData] = useState(sampleData);
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    price: "",
    delivery_status: "",
    payment_status: "",
    sales_channel: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const itemsPerPage = 5;

  useEffect(() => {
    applyFilters();
  }, [filters, data]);

  const applyFilters = () => {
    let result = data.filter((item) => {
      return (
        (item.first_name.toLowerCase() + " " + item.last_name.toLowerCase()).includes(filters.name.toLowerCase()) &&
        item.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        item.total_price.toString().includes(filters.price) &&
        item.delivery_status.toLowerCase().includes(filters.delivery_status.toLowerCase()) &&
        item.payment_status.toLowerCase().includes(filters.payment_status.toLowerCase()) &&
        item.sales_channel.toLowerCase().includes(filters.sales_channel.toLowerCase())
      );
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split("\n");
        const headers = lines[0].split(",");
        const newData = lines.slice(1).map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
          }, {});
        });
        setData(newData);
      } catch (error) {
        alert("Error parsing CSV. Please ensure it matches the required format.");
      }
    };
    reader.readAsText(file);
  };

  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(",");
    const csv = [
      headers,
      ...filteredData.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Real-Time Data Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Filter by name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <Input
              placeholder="Filter by email"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            />
            <Input
              placeholder="Filter by price"
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
            />
            <Select
              value={filters.delivery_status}
              onValueChange={(value) => setFilters({ ...filters, delivery_status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by delivery status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.payment_status}
              onValueChange={(value) => setFilters({ ...filters, payment_status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.sales_channel}
              onValueChange={(value) => setFilters({ ...filters, sales_channel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by sales channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-store">In-store</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between mb-4">
            <Input type="file" accept=".csv" onChange={handleFileUpload} />
            <Button onClick={exportToCSV}>Export to CSV</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead onClick={() => handleSort("total_price")} className="cursor-pointer">
                  Total Price
                </TableHead>
                <TableHead onClick={() => handleSort("unit_price")} className="cursor-pointer">
                  Unit Price
                </TableHead>
                <TableHead onClick={() => handleSort("quantity")} className="cursor-pointer">
                  Quantity
                </TableHead>
                <TableHead onClick={() => handleSort("payment_status")} className="cursor-pointer">
                  Payment Status
                </TableHead>
                <TableHead onClick={() => handleSort("delivery_status")} className="cursor-pointer">
                  Delivery Status
                </TableHead>
                <TableHead onClick={() => handleSort("discount_applied")} className="cursor-pointer">
                  Discount Applied
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.total_price}</TableCell>
                  <TableCell>{item.unit_price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.payment_status}</TableCell>
                  <TableCell>{item.delivery_status}</TableCell>
                  <TableCell>{item.discount_applied}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {pageCount}
            </span>
            <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageCount}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}