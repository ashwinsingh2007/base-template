import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const generateDummyStocks = () => {
  const companies = ['Apple', 'Google', 'Microsoft', 'Amazon', 'Tesla'];
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    company_name: companies[i % companies.length] + ' Inc.',
    price: (Math.random() * 1000).toFixed(2),
    change: (Math.random() * 10 - 5).toFixed(2),
    market_cap: (Math.random() * 1000000000).toFixed(2)
  }));
};

const generateDummyFunds = () => {
  const funds = ['Growth Fund', 'Value Fund', 'Tech Fund', 'Green Fund'];
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    fund_name: funds[i % funds.length],
    nav: (Math.random() * 100).toFixed(2),
    change: (Math.random() * 5 - 2.5).toFixed(2),
    holdings: Array.from({ length: 5 }, () => ({
      company: generateDummyStocks()[Math.floor(Math.random() * 20)].company_name,
      price: (Math.random() * 1000).toFixed(2)
    }))
  }));
};

function StockCard({ stock, onHoldingsClick }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{stock.company_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Price: ${stock.price}</p>
        <p>Change: {stock.change > 0 ? '+' : ''}{stock.change}%</p>
        <p>Market Cap: ${stock.market_cap}</p>
        <Button onClick={() => onHoldingsClick(stock)}>View Holdings</Button>
      </CardContent>
    </Card>
  );
}

function FundCard({ fund }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{fund.fund_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>NAV: ${fund.nav}</p>
        <p>Change: {fund.change > 0 ? '+' : ''}{fund.change}%</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>View Holdings</Button>
          </DialogTrigger>
          <HoldingsDialog holdings={fund.holdings} />
        </Dialog>
      </CardContent>
    </Card>
  );
}

function HoldingsDialog({ holdings }) {
  const [filter, setFilter] = useState('');
  const filteredHoldings = holdings.filter(h => 
    h.company.toLowerCase().includes(filter.toLowerCase()) || 
    h.price.includes(filter)
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Fund Holdings</DialogTitle>
        <Input 
          placeholder="Filter by company or price"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </DialogHeader>
      {filteredHoldings.map((h, idx) => (
        <div key={idx}>
          <p>{h.company} - ${h.price}</p>
        </div>
      ))}
    </DialogContent>
  );
}

export default function App() {
  const [stocks, setStocks] = useState(generateDummyStocks());
  const [funds, setFunds] = useState(generateDummyFunds());
  const [stockFilter, setStockFilter] = useState({ name: '', price: '', marketCap: '' });
  const [fundFilter, setFundFilter] = useState({ name: '', nav: '' });

  const filteredStocks = stocks.filter(stock => 
    stock.company_name.toLowerCase().includes(stockFilter.name.toLowerCase()) &&
    stock.price.includes(stockFilter.price) &&
    stock.market_cap.includes(stockFilter.marketCap)
  );

  const filteredFunds = funds.filter(fund => 
    fund.fund_name.toLowerCase().includes(fundFilter.name.toLowerCase()) &&
    fund.nav.includes(fundFilter.nav)
  );

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="stocks" className="w-full">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="funds">Mutual Funds</TabsTrigger>
        </TabsList>
        <TabsContent value="stocks">
          <Input 
            placeholder="Filter by name"
            value={stockFilter.name}
            onChange={(e) => setStockFilter({...stockFilter, name: e.target.value})}
            className="mb-4"
          />
          <Input 
            placeholder="Filter by price"
            value={stockFilter.price}
            onChange={(e) => setStockFilter({...stockFilter, price: e.target.value})}
            className="mb-4"
          />
          <Input 
            placeholder="Filter by market cap"
            value={stockFilter.marketCap}
            onChange={(e) => setStockFilter({...stockFilter, marketCap: e.target.value})}
            className="mb-4"
          />
          {filteredStocks.map(stock => <StockCard key={stock.id} stock={stock} onHoldingsClick={() => {}} />)}
        </TabsContent>
        <TabsContent value="funds">
          <Input 
            placeholder="Filter by fund name"
            value={fundFilter.name}
            onChange={(e) => setFundFilter({...fundFilter, name: e.target.value})}
            className="mb-4"
          />
          <Input 
            placeholder="Filter by NAV"
            value={fundFilter.nav}
            onChange={(e) => setFundFilter({...fundFilter, nav: e.target.value})}
            className="mb-4"
          />
          {filteredFunds.map(fund => <FundCard key={fund.id} fund={fund} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}