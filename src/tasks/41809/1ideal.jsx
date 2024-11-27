import React, { useState, useMemo } from "react"; // Import necessary React hooks
import { Button } from "@/components/ui/button"; // Import Button component
import { Input } from "@/components/ui/input"; // Import Input component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import table components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // Import tab components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import dialog components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import select dropdown components

// Dummy stock data for display
const dummyStocks = [
  { id: 1, name: "AAPL", price: 150.25, change: 2.5, marketCap: "2.5T" },
  { id: 2, name: "GOOGL", price: 2800.75, change: -1.2, marketCap: "1.9T" },
  { id: 3, name: "MSFT", price: 305.50, change: 0.8, marketCap: "2.3T" },
  { id: 4, name: "AMZN", price: 3300.00, change: -0.5, marketCap: "1.7T" },
  { id: 5, name: "FB", price: 330.20, change: 1.5, marketCap: "935B" },
  { id: 6, name: "TSLA", price: 750.80, change: 3.2, marketCap: "750B" },
  { id: 7, name: "NFLX", price: 540.50, change: -2.1, marketCap: "239B" },
  { id: 8, name: "NVDA", price: 220.75, change: 1.8, marketCap: "548B" },
  { id: 9, name: "JPM", price: 155.30, change: 0.3, marketCap: "465B" },
  { id: 10, name: "V", price: 230.00, change: -0.7, marketCap: "495B" },
  { id: 11, name: "JNJ", price: 170.50, change: 0.5, marketCap: "448B" },
  { id: 12, name: "WMT", price: 140.80, change: -0.2, marketCap: "393B" },
  { id: 13, name: "PG", price: 142.25, change: 0.9, marketCap: "350B" },
  { id: 14, name: "MA", price: 360.40, change: 1.1, marketCap: "355B" },
  { id: 15, name: "UNH", price: 410.60, change: -1.5, marketCap: "387B" },
  { id: 16, name: "HD", price: 330.75, change: 2.2, marketCap: "351B" },
  { id: 17, name: "DIS", price: 175.30, change: -0.8, marketCap: "318B" },
  { id: 18, name: "PYPL", price: 280.90, change: 1.7, marketCap: "330B" },
  { id: 19, name: "BAC", price: 40.15, change: 0.4, marketCap: "339B" },
  { id: 20, name: "ADBE", price: 630.20, change: -1.9, marketCap: "300B" },
];

export default function App() {
  const [stocks, setStocks] = useState(dummyStocks); // State for stock data
  const [portfolio, setPortfolio] = useState([]); // State for portfolio data
  const [balance, setBalance] = useState(10000); // State for user balance
  const [searchTerm, setSearchTerm] = useState(""); // State for stock search term
  const [priceFilter, setPriceFilter] = useState(""); // State for price filter
  const [sortColumn, setSortColumn] = useState(""); // State for sorting column
  const [sortDirection, setSortDirection] = useState("asc"); // State for sort direction
  const [selectedStock, setSelectedStock] = useState(null); // State for selected stock
  const [isBuyDialogOpen, setBuyDialogOpen] = useState(false); // State for buy dialog visibility

  // Filtered and sorted stock list based on user inputs
  const filteredStocks = useMemo(() => {
    return stocks
      .filter((stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((stock) => {
        if (priceFilter === "low") return stock.price < 100;
        if (priceFilter === "medium") return stock.price >= 100 && stock.price < 500;
        if (priceFilter === "high") return stock.price >= 500;
        return true;
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [stocks, searchTerm, priceFilter, sortColumn, sortDirection]);

  // Handle sorting when a table header is clicked
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handle buying a stock
  const handleBuy = (stock) => {
    if (balance >= stock.price) {
      setBalance(balance - stock.price);
      setPortfolio([...portfolio, { ...stock, quantity: 1 }]);
    }
    setBuyDialogOpen(false); // Close dialog after buying
  };

  // Handle selling a stock
  const handleSell = (stock) => {
    const stockInPortfolio = portfolio.find((item) => item.id === stock.id);
    if (stockInPortfolio) {
      setBalance(balance + stock.price);
      const updatedPortfolio = portfolio.filter((item) => item.id !== stock.id);
      setPortfolio(updatedPortfolio);
    }
  };

  // Reusable table component for displaying stock data
  const StockTable = ({ data, onAction, actionLabel }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort("name")}>Name</TableHead>
          <TableHead onClick={() => handleSort("price")}>Current Price</TableHead>
          <TableHead onClick={() => handleSort("change")}>Change</TableHead>
          <TableHead onClick={() => handleSort("marketCap")}>Market Cap</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((stock) => (
          <TableRow key={stock.id}>
            <TableCell>{stock.name}</TableCell>
            <TableCell>${stock.price.toFixed(2)}</TableCell>
            <TableCell
              className={
                stock.change >= 0 ? "text-green-500" : "text-red-500"
              }
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change}%
            </TableCell>
            <TableCell>{stock.marketCap}</TableCell>
            <TableCell>
              {actionLabel === "Buy" ? (
                <Dialog open={isBuyDialogOpen} onOpenChange={setBuyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedStock(stock);
                        setBuyDialogOpen(true);
                      }}
                    >
                      {actionLabel}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Purchase</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to buy {stock.name} for $
                        {stock.price.toFixed(2)}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        onClick={() => handleBuy(stock)}
                        disabled={balance < stock.price}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setBuyDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button onClick={() => onAction(stock)}>{actionLabel}</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Main application rendering
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Stock Trading App</h1>
      <p className="mb-4">Balance: ${balance.toFixed(2)}</p>
      <Tabs defaultValue="market">
        <TabsList>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="market">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search stocks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Select onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full sm:w-1/3">
                <SelectValue placeholder="Filter by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All prices</SelectItem>
                <SelectItem value="low">Low (&lt; $100)</SelectItem>
                <SelectItem value="medium">Medium ($100 - $500)</SelectItem>
                <SelectItem value="high">High (&gt; $500)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <StockTable data={filteredStocks} onAction={handleBuy} actionLabel="Buy" />
        </TabsContent>
        <TabsContent value="portfolio">
          <StockTable data={portfolio} onAction={handleSell} actionLabel="Sell" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
