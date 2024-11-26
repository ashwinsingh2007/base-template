
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for initial render
const initialSalesData = [
  { id: 1, product: 'Product A', revenue: 1000, date: '2023-01-01' },
  { id: 2, product: 'Product B', revenue: 1500, date: '2023-01-02' },
];

const initialUsersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    registrationDate: '2023-01-01',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    registrationDate: '2023-01-02',
  },
];

export default function App() {
  const [salesData, setSalesData] = useState(initialSalesData);
  const [usersData, setUsersData] = useState(initialUsersData);
  const [activeTab, setActiveTab] = useState('sales');
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterValue, setFilterValue] = useState('');

  // Simulated real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'sales') {
        setSalesData((prevData) => [
          ...prevData,
          {
            id: prevData.length + 1,
            product: `Product ${String.fromCharCode(
              65 + Math.floor(Math.random() * 26)
            )}`,
            revenue: Math.floor(Math.random() * 2000) + 500,
            date: new Date().toISOString().split('T')[0],
          },
        ]);
      } else {
        setUsersData((prevData) => [
          ...prevData,
          {
            id: prevData.length + 1,
            name: `User ${prevData.length + 1}`,
            email: `user${prevData.length + 1}@example.com`,
            registrationDate: new Date().toISOString().split('T')[0],
          },
        ]);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [activeTab, refreshInterval]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split('\n');
        const headers = rows[0].split(',');
        const newData = rows.slice(1).map((row) => {
          const values = row.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
          }, {});
        });

        if (activeTab === 'sales') {
          setSalesData(newData);
        } else {
          setUsersData(newData);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const data = activeTab === 'sales' ? salesData : usersData;
    const headers = Object.keys(data[0]).join(',');
    const csv = [
      headers,
      ...data.map((row) => Object.values(row).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeTab}_data.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredData = (activeTab === 'sales' ? salesData : usersData).filter(
    (item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(filterValue.toLowerCase())
      )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Real-Time Data Dashboard</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <Button
            onClick={() => setActiveTab('sales')}
            variant={activeTab === 'sales' ? 'default' : 'outline'}
          >
            Sales
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'outline'}
          >
            Users
          </Button>
        </div>
        <div className="flex space-x-2">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="max-w-xs"
          />
          <Button onClick={handleExport}>Export CSV</Button>
        </div>
      </div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Dashboard Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Select
              value={refreshInterval.toString()}
              onValueChange={(value) => setRefreshInterval(parseInt(value))}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Refresh Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">1 second</SelectItem>
                <SelectItem value="5000">5 seconds</SelectItem>
                <SelectItem value="10000">10 seconds</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter data..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full sm:w-auto"
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'sales' ? 'Sales Data' : 'Users Data'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(sortedData[0] || {}).map((key) => (
                  <TableHead
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortColumn === key &&
                      (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow key={index}>
                  {Object.values(item).map((value, i) => (
                    <TableCell key={i}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

