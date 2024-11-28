// Import necessary React hooks and UI components
import React, { useState, useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // Tabs for navigation between sections
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Card components for wrapping content
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Table components for displaying data
import { Input } from "@/components/ui/input"; // Input components for filters
import { Button } from "@/components/ui/button"; // Button components for actions
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Dialog for displaying detailed information
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select dropdown for quantity selection
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"; // Alert for error messages

// Dummy data for stocks
const dummyStocks = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Company ${i + 1}`,
  price: parseFloat((Math.random() * 500).toFixed(2)), // Random price
  change: parseFloat((Math.random() * 10 - 5).toFixed(2)), // Random change (-5 to 5)
  marketCap: parseFloat((Math.random() * 5000).toFixed(2)), // Random market cap
}));

// Dummy data for mutual funds
const dummyMutualFunds = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Mutual Fund ${i + 1}`,
  nav: parseFloat((Math.random() * 500).toFixed(2)), // Random NAV
  change: parseFloat((Math.random() * 10 - 5).toFixed(2)), // Random change (-5 to 5)
  holdings: Array.from({ length: 10 }, (_, j) => ({
    name: `Company ${j + 1}`,
    price: parseFloat((Math.random() * 500).toFixed(2)), // Random price
  })),
}));

// StockTable component for displaying stock data
function StockTable({ stocks, onBuy }) {
  const [sortColumn, setSortColumn] = useState(null); // State for sorting column
  const [sortDirection, setSortDirection] = useState("asc"); // State for sorting direction
  const [filter, setFilter] = useState({ name: "", price: "", marketCap: "" }); // State for filters

  // Filter and sort stocks based on user input
  const sortedAndFilteredStocks = useMemo(() => {
    let result = stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(filter.name.toLowerCase()) &&
        (filter.price === "" || stock.price <= parseFloat(filter.price)) &&
        (filter.marketCap === "" || stock.marketCap <= parseFloat(filter.marketCap))
    );

    // Apply sorting if a sort column is selected
    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [stocks, sortColumn, sortDirection, filter]);

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stocks</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter inputs for stocks */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Input
            placeholder="Filter by name"
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
          <Input
            placeholder="Max price"
            type="number"
            onChange={(e) => setFilter({ ...filter, price: e.target.value })}
          />
          <Input
            placeholder="Max market cap"
            type="number"
            onChange={(e) => setFilter({ ...filter, marketCap: e.target.value })}
          />
        </div>
        {/* Stock table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                Name
              </TableHead>
              <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
                Price
              </TableHead>
              <TableHead>Change</TableHead>
              <TableHead onClick={() => handleSort("marketCap")} className="cursor-pointer">
                Market Cap
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Render sorted and filtered stocks */}
            {sortedAndFilteredStocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>${stock.price.toFixed(2)}</TableCell>
                <TableCell
                  className={stock.change >= 0 ? "text-green-600" : "text-red-600"}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change}%
                </TableCell>
                <TableCell>${stock.marketCap}B</TableCell>
                <TableCell>
                  <Button onClick={() => onBuy(stock)}>Buy</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// MutualFundTable component for displaying mutual fund data
function MutualFundTable({ funds }) {
  const [sortColumn, setSortColumn] = useState(null); // State for sorting column
  const [sortDirection, setSortDirection] = useState("asc"); // State for sorting direction
  const [filter, setFilter] = useState({ name: "", nav: "" }); // State for filters
  const [selectedFund, setSelectedFund] = useState(null); // State for selected fund in dialog
  const [holdingFilter, setHoldingFilter] = useState({ name: "", price: "" }); // State for filtering holdings

  // Filter and sort mutual funds
  const sortedAndFilteredFunds = useMemo(() => {
    let result = funds.filter(
      (fund) =>
        fund.name.toLowerCase().includes(filter.name.toLowerCase()) &&
        (filter.nav === "" || fund.nav <= parseFloat(filter.nav))
    );

    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [funds, sortColumn, sortDirection, filter]);

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mutual Funds</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter inputs for mutual funds */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Input
            placeholder="Filter by name"
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
          <Input
            placeholder="Max NAV"
            type="number"
            onChange={(e) => setFilter({ ...filter, nav: e.target.value })}
          />
        </div>
        {/* Mutual fund table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                Name
              </TableHead>
              <TableHead onClick={() => handleSort("nav")} className="cursor-pointer">
                NAV
              </TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Render sorted and filtered mutual funds */}
            {sortedAndFilteredFunds.map((fund) => (
              <TableRow key={fund.id}>
                <TableCell>{fund.name}</TableCell>
                <TableCell>${fund.nav.toFixed(2)}</TableCell>
                <TableCell
                  className={fund.change >= 0 ? "text-green-600" : "text-red-600"}
                >
                  {fund.change >= 0 ? "+" : ""}
                  {fund.change}%
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedFund(fund)}>View Holdings</Button>
                    </DialogTrigger>
                    <DialogContent className="w-[525px] h-[500px]">
                      <DialogHeader>
                        <DialogTitle>{fund.name} Holdings</DialogTitle>
                      </DialogHeader>
                      <div className="mb-4 flex gap-2">
                        <Input
                          placeholder="Filter by name"
                          onChange={(e) => setHoldingFilter({ ...holdingFilter, name: e.target.value })}
                        />
                        <Input
                          placeholder="Max price"
                          type="number"
                          onChange={(e) => setHoldingFilter({ ...holdingFilter, price: e.target.value })}
                        />
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Render filtered holdings */}
                          {selectedFund?.holdings
                            ?.filter(
                              (holding) =>
                                holding.name.toLowerCase().includes(holdingFilter.name.toLowerCase()) &&
                                (holdingFilter.price === "" || holding.price <= parseFloat(holdingFilter.price))
                            )
                            .map((holding, index) => (
                              <TableRow key={index}>
                                <TableCell>{holding.name}</TableCell>
                                <TableCell>${holding.price.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Portfolio component for displaying owned stocks and mutual funds
function Portfolio({ portfolio, onSell }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Portfolio table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Render portfolio items */}
            {portfolio.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button onClick={() => onSell(item)}>Sell</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Main application component
export default function App() {
  const [balance, setBalance] = useState(1000); // State for user balance
  const [portfolio, setPortfolio] = useState([]); // State for portfolio items
  const [buyingStock, setBuyingStock] = useState(null); // State for stock being purchased
  const [quantity, setQuantity] = useState(1); // State for purchase quantity
  const [error, setError] = useState(null); // State for errors during purchase

  // Handle buying a stock
  const handleBuy = (stock) => {
    setBuyingStock(stock);
    setQuantity(1);
    setError(null);
  };

  // Confirm the stock purchase
  const confirmBuy = () => {
    const totalCost = buyingStock.price * quantity;
    if (totalCost > balance) {
      setError("Insufficient funds");
      return;
    }
    setBalance(balance - totalCost);
    const existingStock = portfolio.find((item) => item.name === buyingStock.name);
    if (existingStock) {
      setPortfolio(
        portfolio.map((item) =>
          item.name === buyingStock.name ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      setPortfolio([...portfolio, { ...buyingStock, quantity }]);
    }
    setBuyingStock(null);
  };

  // Handle selling a stock
  const handleSell = (stock) => {
    setBalance(balance + stock.price * stock.quantity);
    setPortfolio(portfolio.filter((item) => item.name !== stock.name));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Stock Market Watchlist</h1>
      <p className="mb-4">Balance: ${balance.toFixed(2)}</p>
      {/* Tabs for switching between sections */}
      <Tabs defaultValue="stocks">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="mutualFunds">Mutual Funds</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="stocks">
          <StockTable stocks={dummyStocks} onBuy={handleBuy} />
        </TabsContent>
        <TabsContent value="mutualFunds">
          <MutualFundTable funds={dummyMutualFunds} />
        </TabsContent>
        <TabsContent value="portfolio">
          <Portfolio portfolio={portfolio} onSell={handleSell} />
        </TabsContent>
      </Tabs>
      {/* Dialog for purchasing stocks */}
      {buyingStock && (
        <Dialog open={!!buyingStock} onOpenChange={() => setBuyingStock(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buy {buyingStock.name}</DialogTitle>
            </DialogHeader>
            <p>Price: ${buyingStock.price.toFixed(2)}</p>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select quantity" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p>Total: ${(buyingStock.price * quantity).toFixed(2)}</p>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button onClick={confirmBuy}>Confirm Purchase</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
