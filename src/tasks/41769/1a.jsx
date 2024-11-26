import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data generator
const generateSampleData = () => {
  const categories = ["Electronics", "Clothing", "Food", "Books", "Toys"];
  const suppliers = ["Supplier A", "Supplier B", "Supplier C", "Supplier D"];
  const locations = ["Warehouse A", "Warehouse B", "Store C", "Store D"];

  return Array.from({ length: 50 }, (_, i) => ({
    product_id: i + 1,
    product_name: `Product ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    SKU: `SKU-${Math.random().toString(36).substr(2, 9)}`,
    stock_quantity: Math.floor(Math.random() * 100),
    reorder_level: Math.floor(Math.random() * 20),
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    purchase_price: parseFloat((Math.random() * 100).toFixed(2)),
    sale_price: parseFloat((Math.random() * 200).toFixed(2)),
    profit_margin: parseFloat((Math.random() * 0.5).toFixed(2)),
    location: locations[Math.floor(Math.random() * locations.length)],
    date_added: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
  }));
};

const InventoryTable = ({ data, onSort }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("stock_quantity")}>Stock Quantity</TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("reorder_level")}>Reorder Level</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("purchase_price")}>Purchase Price</TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("sale_price")}>Sale Price</TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("profit_margin")}>Profit Margin</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort("date_added")}>Date Added</TableHead>
          <TableHead>Restock Needed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.product_id} className={item.stock_quantity <= item.reorder_level ? "bg-red-100" : ""}>
            <TableCell>{item.product_id}</TableCell>
            <TableCell>{item.product_name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.SKU}</TableCell>
            <TableCell>{item.stock_quantity}</TableCell>
            <TableCell>{item.reorder_level}</TableCell>
            <TableCell>{item.supplier}</TableCell>
            <TableCell>${item.purchase_price.toFixed(2)}</TableCell>
            <TableCell>${item.sale_price.toFixed(2)}</TableCell>
            <TableCell>{(item.profit_margin * 100).toFixed(2)}%</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.date_added}</TableCell>
            <TableCell>{item.stock_quantity <= item.reorder_level ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const FilterSection = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    product_name: "",
    category: "",
    SKU: "",
    supplier: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Input
          placeholder="Product Name"
          name="product_name"
          value={filters.product_name}
          onChange={handleChange}
        />
        <Input
          placeholder="Category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        />
        <Input
          placeholder="SKU"
          name="SKU"
          value={filters.SKU}
          onChange={handleChange}
        />
        <Input
          placeholder="Supplier"
          name="supplier"
          value={filters.supplier}
          onChange={handleChange}
        />
        <Input
          placeholder="Location"
          name="location"
          value={filters.location}
          onChange={handleChange}
        />
        <Button onClick={applyFilters}>Apply Filters</Button>
      </CardContent>
    </Card>
  );
};

const CSVUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        // Process CSV and validate
        const lines = csv.split("\n");
        const headers = lines[0].split(",");
        const requiredFields = [
          "product_id",
          "product_name",
          "category",
          "SKU",
          "stock_quantity",
          "reorder_level",
          "supplier",
          "purchase_price",
          "sale_price",
          "profit_margin",
          "location",
          "date_added",
        ];

        if (requiredFields.every((field) => headers.includes(field))) {
          const data = lines.slice(1).map((line) => {
            const values = line.split(",");
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {});
          });
          onUpload(data);
        } else {
          alert("CSV format is incorrect. Please check the required fields.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>CSV Upload</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input type="file" accept=".csv" onChange={handleFileChange} />
        <Button onClick={handleUpload}>Upload</Button>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [inventoryData, setInventoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Initialize with sample data
    setInventoryData(generateSampleData());
  }, []);

  useEffect(() => {
    // Apply search and filtering
    let result = inventoryData;
    if (searchTerm) {
      result = result.filter((item) =>
        Object.values(item).some((val) =>
          val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredData(result);
  }, [inventoryData, searchTerm]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    setFilteredData(prev => [...prev].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    }));
  };

  const handleFilter = (filters) => {
    const filtered = inventoryData.filter((item) =>
      Object.entries(filters).every(([key, value]) =>
        item[key].toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleCSVUpload = (data) => {
    setInventoryData((prev) => [...prev, ...data]);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      Object.keys(filteredData[0]).join(",") + "\n" +
      filteredData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const pageSize = 10;
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management Dashboard</h1>
      <Input
        type="text"
        placeholder="Global Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <FilterSection onFilter={handleFilter} />
      <CSVUpload onUpload={handleCSVUpload} />
      <Card className="mb-4">
        <CardContent>
          <InventoryTable data={paginatedData} onSort={handleSort} />
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {pageCount}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleExport}>Export to CSV</Button>
    </div>
  );
}