import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Generate sample data with 20 records for demonstration purposes
const initialData = Array.from({ length: 20 }, (_, i) => ({
  first_name: `First${i + 1}`,
  last_name: `Last${i + 1}`,
  email: `user${i + 1}@example.com`,
  product_name: `Product ${i + 1}`,
  product_id: `prod_00${i + 1}`,
  total_price: (i + 1) * 10, // Example total price
  unit_price: (i + 1) * 5, // Example unit price
  quantity: i % 5 + 1, // Example quantity
  phone_number: `+141555526${70 + i}`, // Example phone number
  registration_date: new Date().toISOString(), // Current date
  status: i % 2 === 0 ? "active" : "inactive", // Alternate active/inactive status
  address: `Address ${i + 1}`, // Example address
  payment_status: i % 2 === 0 ? "completed" : "pending", // Alternate payment statuses
  delivery_status: i % 2 === 0 ? "delivered" : "pending", // Alternate delivery statuses
  region: i % 2 === 0 ? "North America" : "Europe", // Alternate regions
  sales_channel: i % 2 === 0 ? "online" : "in-store", // Alternate sales channels
  discount_applied: (i % 3 + 1) * 5, // Example discount applied
}));

export default function App() {
  // State for the complete dataset
  const [data, setData] = useState(initialData);

  // State for filtered data after applying filters and sorting
  const [filteredData, setFilteredData] = useState(data);

  // State to track the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // State to store active filters
  const [filters, setFilters] = useState({});

  // State for sorting configuration (key and direction)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const itemsPerPage = 5; // Number of items displayed per page

  useEffect(() => {
    // Filter and sort the data whenever filters or sorting config change
    let result = data;

    // Apply filters to the dataset
    Object.keys(filters).forEach((key) => {
      result = result.filter((item) =>
        item[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
      );
    });

    // Apply sorting to the dataset if a sort key is set
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = parseFloat(a[sortConfig.key]) || a[sortConfig.key];
        const bValue = parseFloat(b[sortConfig.key]) || b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result); // Update filtered data state
    setCurrentPage(1); // Reset to the first page after filtering or sorting
  }, [data, filters, sortConfig]);

  // Handle filter changes
  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle column sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  // Handle CSV file upload and parse the data
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
          const parsedData = headers.reduce((obj, header, index) => {
            const key = header.trim();
            let value = values[index]?.trim();
            if (key === "discount_applied") value = parseFloat(value) || 0; // Ensure numbers for discounts
            obj[key] = value;
            return obj;
          }, {});
          return parsedData;
        });
        setData(newData); // Update state with parsed data
      } catch (error) {
        alert("Error parsing CSV. Please ensure it matches the required format.");
      }
    };
    reader.readAsText(file);
  };

  // Export the filtered data to a CSV file
  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(","); // Create CSV headers
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

  // Paginate the filtered data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      {/* Card component for the dashboard */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Real-Time Data Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter inputs and dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input placeholder="Filter by name" onChange={(e) => handleFilter("first_name", e.target.value)} />
            <Input placeholder="Filter by email" onChange={(e) => handleFilter("email", e.target.value)} />
            <Input placeholder="Filter by price" onChange={(e) => handleFilter("total_price", e.target.value)} />
            {/* Dropdown filters */}
            <Select onValueChange={(value) => handleFilter("delivery_status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by delivery status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilter("payment_status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilter("sales_channel", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sales channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-store">In-store</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* File upload and export to CSV button */}
          <div className="flex justify-between mb-4">
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <Button onClick={exportToCSV}>Export to CSV</Button>
          </div>
          {/* Data table */}
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(initialData[0]).map((key) => (
                  <TableHead key={key} onClick={() => handleSort(key)} className="cursor-pointer">
                    {key.replace(/_/g, " ")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {Object.values(item).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination controls */}
          <div className="flex justify-between mt-4">
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span>Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}</span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
