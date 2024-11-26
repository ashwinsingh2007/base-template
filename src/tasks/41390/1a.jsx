import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const initialData = [
  // 20 sample records would go here. For brevity, I'll add only a couple:
  {
    first_name: "John", last_name: "Doe", email: "john.doe@example.com", product_name: "Wireless Mouse",
    product_id: "prod_001", total_price: 59.98, unit_price: 29.99, quantity: 2, phone_number: "+14155552671",
    registration_date: "2024-01-15T14:30:00Z", status: "active", address: "123 Main St, Springfield",
    payment_status: "completed", delivery_status: "delivered", region: "North America", sales_channel: "online", discount_applied: 10.0
  },
  {
    first_name: "Jane", last_name: "Smith", email: "jane.smith@example.com", product_name: "Laptop Stand",
    product_id: "prod_002", total_price: 35.00, unit_price: 35.00, quantity: 1, phone_number: "+14155552672",
    registration_date: "2024-01-16T09:15:00Z", status: "inactive", address: "456 Elm St, Anytown",
    payment_status: "pending", delivery_status: "processing", region: "Europe", sales_channel: "physical", discount_applied: 0.0
  },
  // Add more records here...
];

function App() {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    name: '', email: '', price: '', delivery_status: '', payment_status: '', sales_channel: ''
  });
  const [page, setPage] = useState(1);
  const recordsPerPage = 5;

  const applyFilters = useCallback(() => {
    let result = data.filter(item => 
      (item.first_name.toLowerCase() + ' ' + item.last_name.toLowerCase()).includes(filters.name.toLowerCase()) &&
      item.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      (filters.price === '' || item.total_price == filters.price) &&
      (filters.delivery_status === '' || item.delivery_status === filters.delivery_status) &&
      (filters.payment_status === '' || item.payment_status === filters.payment_status) &&
      (filters.sales_channel === '' || item.sales_channel === filters.sales_channel)
    );
    setFilteredData(result);
  }, [data, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const newData = JSON.parse(content);
        setData(prevData => [...prevData, ...newData]);
      } catch (error) {
        alert("Invalid CSV format.");
      }
    };
    reader.readAsText(file);
  };

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(filteredData[0]).join(",") + "\n" 
      + filteredData.map(row => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Sales and User Data Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
            <Input type="text" name="name" placeholder="Filter by name" onChange={handleFilterChange} value={filters.name} />
            <Input type="email" name="email" placeholder="Filter by email" onChange={handleFilterChange} value={filters.email} />
            <Input type="number" name="price" placeholder="Filter by price" onChange={handleFilterChange} value={filters.price} />
            <select name="delivery_status" onChange={handleFilterChange} value={filters.delivery_status} className="p-2 border rounded">
              <option value="">All Delivery Status</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
            </select>
            <select name="payment_status" onChange={handleFilterChange} value={filters.payment_status} className="p-2 border rounded">
              <option value="">All Payment Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <select name="sales_channel" onChange={handleFilterChange} value={filters.sales_channel} className="p-2 border rounded">
              <option value="">All Channels</option>
              <option value="online">Online</option>
              <option value="physical">Physical</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <input type="file" onChange={handleCSVUpload} accept=".json" className="mb-2 sm:mb-0" />
            <Button onClick={exportToCSV}>Export CSV</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('first_name')}>Name</TableHead>
                <TableHead onClick={() => requestSort('email')}>Email</TableHead>
                <TableHead onClick={() => requestSort('total_price')}>Total Price</TableHead>
                <TableHead onClick={() => requestSort('delivery_status')}>Delivery</TableHead>
                <TableHead onClick={() => requestSort('payment_status')}>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.slice((page - 1) * recordsPerPage, page * recordsPerPage).map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.first_name} {item.last_name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>${item.total_price}</TableCell>
                  <TableCell>{item.delivery_status}</TableCell>
                  <TableCell>{item.payment_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button disabled={page * recordsPerPage >= filteredData.length} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;