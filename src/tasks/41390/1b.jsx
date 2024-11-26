import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data
const initialData = [
  {
    first_name: "John", last_name: "Doe", email: "john.doe@example.com", product_name: "Wireless Mouse",
    product_id: "prod_001", total_price: 59.98, unit_price: 29.99, quantity: 2, phone_number: "+14155552671",
    registration_date: "2024-01-15T14:30:00Z", status: "active", address: "123 Main St, Springfield",
    payment_status: "completed", delivery_status: "delivered", region: "North America", sales_channel: "online",
    discount_applied: 10.0
  },
  // ... (19 more sample records)
];

export default function App() {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const itemsPerPage = 5;

  useEffect(() => {
    let result = data;

    // Apply filters
    Object.keys(filters).forEach(key => {
      result = result.filter(item => 
        item[key].toString().toLowerCase().includes(filters[key].toLowerCase())
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [data, filters, sortConfig]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const newData = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
          }, {});
        });
        setData(newData);
      } catch (error) {
        alert('Error parsing CSV. Please ensure it matches the required format.');
      }
    };
    reader.readAsText(file);
  };

  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(',');
    const csv = [
      headers,
      ...filteredData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
              onChange={(e) => handleFilter('first_name', e.target.value)}
            />
            <Input 
              placeholder="Filter by email" 
              onChange={(e) => handleFilter('email', e.target.value)}
            />
            <Input 
              placeholder="Filter by price" 
              onChange={(e) => handleFilter('total_price', e.target.value)}
            />
            <Select onValueChange={(value) => handleFilter('delivery_status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by delivery status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilter('payment_status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilter('sales_channel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sales channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-store">In-store</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between mb-4">
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <Button onClick={exportToCSV}>Export to CSV</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead onClick={() => handleSort('total_price')} className="cursor-pointer">
                  Total Price
                </TableHead>
                <TableHead onClick={() => handleSort('unit_price')} className="cursor-pointer">
                  Unit Price
                </TableHead>
                <TableHead onClick={() => handleSort('quantity')} className="cursor-pointer">
                  Quantity
                </TableHead>
                <TableHead onClick={() => handleSort('payment_status')} className="cursor-pointer">
                  Payment Status
                </TableHead>
                <TableHead onClick={() => handleSort('delivery_status')} className="cursor-pointer">
                  Delivery Status
                </TableHead>
                <TableHead onClick={() => handleSort('discount_applied')} className="cursor-pointer">
                  Discount
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
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}</span>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredData.length / itemsPerPage)))}
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