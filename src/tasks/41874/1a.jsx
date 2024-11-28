import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const dummyStocks = [
  { id: 1, name: "Apple Inc.", price: 150.25, change: 2.5, marketCap: 2500 },
  { id: 2, name: "Microsoft Corp.", price: 300.50, change: -1.2, marketCap: 2300 },
  // ... (add 18 more dummy stocks)
];

const dummyMutualFunds = [
  { id: 1, name: "Vanguard 500 Index Fund", nav: 400.75, change: 1.5, holdings: [
    { name: "Apple Inc.", price: 150.25 },
    { name: "Microsoft Corp.", price: 300.50 },
    // ... (add more holdings)
  ]},
  { id: 2, name: "Fidelity Contrafund", nav: 150.20, change: -0.8, holdings: [
    { name: "Amazon.com Inc.", price: 3300.00 },
    { name: "Facebook Inc.", price: 330.25 },
    // ... (add more holdings)
  ]},
  // ... (add 18 more dummy mutual funds)
];

function StockTable({ stocks, onBuy }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState({ name: '', price: '', marketCap: '' });

  const sortedAndFilteredStocks = useMemo(() => {
    let result = stocks.filter(stock => 
      stock.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      (filter.price === '' || stock.price <= parseFloat(filter.price)) &&
      (filter.marketCap === '' || stock.marketCap <= parseFloat(filter.marketCap))
    );

    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [stocks, sortColumn, sortDirection, filter]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stocks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Input placeholder="Filter by name" onChange={e => setFilter({...filter, name: e.target.value})} />
          <Input placeholder="Max price" type="number" onChange={e => setFilter({...filter, price: e.target.value})} />
          <Input placeholder="Max market cap" type="number" onChange={e => setFilter({...filter, marketCap: e.target.value})} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">Name</TableHead>
              <TableHead onClick={() => handleSort('price')} className="cursor-pointer">Price</TableHead>
              <TableHead>Change</TableHead>
              <TableHead onClick={() => handleSort('marketCap')} className="cursor-pointer">Market Cap</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredStocks.map(stock => (
              <TableRow key={stock.id}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>${stock.price.toFixed(2)}</TableCell>
                <TableCell className={stock.change >= 0 ? "text-green-600" : "text-red-600"}>
                  {stock.change >= 0 ? "+" : ""}{stock.change}%
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

function MutualFundTable({ funds }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState({ name: '', nav: '' });
  const [selectedFund, setSelectedFund] = useState(null);

  const sortedAndFilteredFunds = useMemo(() => {
    let result = funds.filter(fund => 
      fund.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      (filter.nav === '' || fund.nav <= parseFloat(filter.nav))
    );

    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [funds, sortColumn, sortDirection, filter]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mutual Funds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Input placeholder="Filter by name" onChange={e => setFilter({...filter, name: e.target.value})} />
          <Input placeholder="Max NAV" type="number" onChange={e => setFilter({...filter, nav: e.target.value})} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">Name</TableHead>
              <TableHead onClick={() => handleSort('nav')} className="cursor-pointer">NAV</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredFunds.map(fund => (
              <TableRow key={fund.id}>
                <TableCell>{fund.name}</TableCell>
                <TableCell>${fund.nav.toFixed(2)}</TableCell>
                <TableCell className={fund.change >= 0 ? "text-green-600" : "text-red-600"}>
                  {fund.change >= 0 ? "+" : ""}{fund.change}%
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedFund(fund)}>View Holdings</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{fund.name} Holdings</DialogTitle>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fund.holdings.map((holding, index) => (
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

function Portfolio({ portfolio, onSell }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
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

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [portfolio, setPortfolio] = useState([]);
  const [buyingStock, setBuyingStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const handleBuy = (stock) => {
    setBuyingStock(stock);
    setQuantity(1);
    setError(null);
  };

  const confirmBuy = () => {
    const totalCost = buyingStock.price * quantity;
    if (totalCost > balance) {
      setError("Insufficient funds");
      return;
    }
    setBalance(balance - totalCost);
    const existingStock = portfolio.find(item => item.name === buyingStock.name);
    if (existingStock) {
      setPortfolio(portfolio.map(item => 
        item.name === buyingStock.name 
          ? {...item, quantity: item.quantity + quantity}
          : item
      ));
    } else {
      setPortfolio([...portfolio, {...buyingStock, quantity}]);
    }
    setBuyingStock(null);
  };

  const handleSell = (stock) => {
    setBalance(balance + stock.price * stock.quantity);
    setPortfolio(portfolio.filter(item => item.name !== stock.name));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Stock Market Watchlist</h1>
      <p className="mb-4">Balance: ${balance.toFixed(2)}</p>
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
                {[1, 2, 3, 4].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p>Total: ${(buyingStock.price * quantity).toFixed(2)}</p>
            {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            <Button onClick={confirmBuy}>Confirm Purchase</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}