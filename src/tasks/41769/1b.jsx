import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  Button, Input, Table, TableHeader, TableBody, 
  TableRow, TableCell, TableHead, Pagination, 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, 
  DropdownMenuItem, Label, Alert, AlertTitle, AlertDescription
} from "@/components/ui";
import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";

// Sample data
const initialData = Array.from({length: 50}, (_, i) => ({
  product_id: i + 1,
  product_name: `Product ${i + 1}`,
  category: `Category ${(i % 5) + 1}`,
  SKU: `SKU-${i}`,
  stock_quantity: Math.floor(Math.random() * 100),
  reorder_level: 10,
  supplier: `Supplier ${(i % 3) + 1}`,
  purchase_price: (Math.random() * 100).toFixed(2),
  sale_price: (Math.random() * 150 + 50).toFixed(2),
  profit_margin: ((Math.random() * 50 + 10).toFixed(2)),
  location: `Warehouse ${String.fromCharCode(65 + (i % 3))}`,
  date_added: new Date(Date.now() - Math.random() * 1e10).toISOString().split('T')[0],
  restock_needed: false
}));

export default function App() {
  const [inventory, setInventory] = useState(initialData);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({search: '', category: '', supplier: '', location: ''});
  const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});

  const itemsPerPage = 10;
  const filteredItems = useMemo(() => {
    return inventory.filter(item => 
      Object.values(item).some(val => 
        val.toString().toLowerCase().includes(filters.search.toLowerCase())
      ) &&
      (filters.category ? item.category === filters.category : true) &&
      (filters.supplier ? item.supplier === filters.supplier : true) &&
      (filters.location ? item.location === filters.location : true)
    );
  }, [inventory, filters]);

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return filteredItems;

    return [...filteredItems].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [filteredItems, sortConfig]);

  const paginatedItems = sortedItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const result = parseCSV(text);
      if (result.error) {
        alert(result.error);
      } else {
        setInventory(prev => [...prev, ...result.data]);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText) => {
    // Implement CSV parsing logic here
    // This is a placeholder for actual parsing
    return { data: [], error: 'CSV parsing not implemented in this example' };
  };

  const exportCSV = () => {
    const headers = Object.keys(inventory[0]).join(',');
    const rows = inventory.map(item => Object.values(item).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory.csv");
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link);
  };

  useEffect(() => {
    setInventory(prev => prev.map(item => ({
      ...item,
      restock_needed: item.stock_quantity <= item.reorder_level
    })));
  }, []);

  return (
    <Card className="p-4 sm:p-8 space-y-4">
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <Input 
            placeholder="Search inventory..." 
            value={filters.search} 
            onChange={e => setFilters({...filters, search: e.target.value})}
          />
          <div className="flex gap-2">
            <Button onClick={exportCSV}>
              <DownloadIcon className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button component="span">
                <UploadIcon className="mr-2 h-4 w-4" /> Upload CSV
              </Button>
              <input id="file-upload" type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter Category</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilters({...filters, category: ''})}>Clear</DropdownMenuItem>
              {[...new Set(inventory.map(i => i.category))].map(cat => (
                <DropdownMenuItem key={cat} onClick={() => setFilters({...filters, category: cat})}>{cat}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Add similar DropdownMenu for supplier and location */}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {['product_name', 'category', 'SKU', 'stock_quantity', 'reorder_level', 'supplier', 'purchase_price', 'sale_price', 'profit_margin', 'location', 'date_added', 'restock_needed'].map(key => (
                <TableHead key={key} onClick={() => requestSort(key)} className="cursor-pointer">
                  {key.replace('_', ' ').toUpperCase()} {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map(item => (
              <TableRow key={item.product_id} className={item.restock_needed ? 'bg-red-100' : ''}>
                {Object.values(item).map((value, idx) => 
                  <TableCell key={idx}>{value}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          total={Math.ceil(sortedItems.length / itemsPerPage)}
          currentPage={page}
          onChange={setPage}
        />
      </CardContent>
    </Card>
  );
}