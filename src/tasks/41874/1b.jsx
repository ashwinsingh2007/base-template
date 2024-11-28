import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Dummy data for stocks and mutual funds
const dummyStocks = [
  { id: 1, name: "Tech Corp", price: 150.23, change: "+2.34%", marketCap: "1.2T" },
  // ... 19 more entries
];

const dummyFunds = [
  { id: 1, name: "Growth Fund", nav: 50.12, change: "+1.2%", holdings: [{company: "Tech Corp", price: 150.23}, /* ... */] },
  // ... 19 more entries
];

function App() {
  const [balance, setBalance] = useState(1000);
  const [portfolio, setPortfolio] = useState([]);
  const [activeTab, setActiveTab] = useState('stocks');
  const [filterStock, setFilterStock] = useState('');
  const [filterFund, setFilterFund] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedFund, setSelectedFund] = useState(null);

  const handleBuy = (stock, quantity) => {
    const cost = stock.price * quantity;
    if (cost > balance) {
      alert("Insufficient funds!");
      return;
    }
    setBalance(balance - cost);
    setPortfolio([...portfolio, { ...stock, quantity }]);
  };

  const handleSell = (stockId, quantity) => {
    const stockToSell = portfolio.find(s => s.id === stockId);
    if (stockToSell && stockToSell.quantity >= quantity) {
      setBalance(balance + (stockToSell.price * quantity));
      setPortfolio(portfolio.map(s => 
        s.id === stockId ? { ...s, quantity: s.quantity - quantity } : s
      ).filter(s => s.quantity > 0));
    }
  };

  const sortedItems = (items, config) => {
    if (!config.key) return items;
    return [...items].sort((a, b) => {
      if (a[config.key] < b[config.key]) return config.direction === 'ascending' ? -1 : 1;
      if (a[config.key] > b[config.key]) return config.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredStocks = sortedItems(dummyStocks.filter(stock => 
    stock.name.toLowerCase().includes(filterStock.toLowerCase()) ||
    stock.price.toString().includes(filterStock) ||
    stock.marketCap.includes(filterStock)
  ), sortConfig);

  const filteredFunds = sortedItems(dummyFunds.filter(fund => 
    fund.name.toLowerCase().includes(filterFund.toLowerCase()) ||
    fund.nav.toString().includes(filterFund)
  ), sortConfig);

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="stocks" className="w-full">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="funds">Mutual Funds</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="stocks">
          <Input 
            placeholder="Filter by name, price, or market cap" 
            value={filterStock} 
            onChange={(e) => setFilterStock(e.target.value)} 
            className="mb-4"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStocks.map(stock => (
              <Card key={stock.id}>
                <CardHeader>
                  <CardTitle>{stock.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Price: ${stock.price}</p>
                  <p>Change: {stock.change}</p>
                  <p>Market Cap: {stock.marketCap}</p>
                  <Button onClick={() => handleBuy(stock, 1)}>Buy</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="funds">
          <Input 
            placeholder="Filter by name or NAV" 
            value={filterFund} 
            onChange={(e) => setFilterFund(e.target.value)} 
            className="mb-4"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFunds.map(fund => (
              <Card key={fund.id}>
                <CardHeader>
                  <CardTitle>{fund.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>NAV: ${fund.nav}</p>
                  <p>Change: {fund.change}</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>View Holdings</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{fund.name} Holdings</DialogTitle>
                      </DialogHeader>
                      {/* Here you would map through fund.holdings with sorting and filtering */}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 gap-4">
            {portfolio.map(stock => (
              <Card key={stock.id}>
                <CardHeader>
                  <CardTitle>{stock.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Quantity: {stock.quantity}</p>
                  <p>Current Price: ${stock.price}</p>
                  <Button onClick={() => handleSell(stock.id, 1)}>Sell</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-4 text-center">Current Balance: ${balance.toFixed(2)}</div>
    </div>
  );
}

export default App;