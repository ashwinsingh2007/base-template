import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dummy data
const stocks = [
  { id: 1, name: "Apple Inc.", price: 150.25, change: 2.5, marketCap: 2500 },
  { id: 2, name: "Microsoft Corp.", price: 300.50, change: -1.2, marketCap: 2300 },
  // ... (18 more dummy stock entries)
];

const mutualFunds = [
  { id: 1, name: "Vanguard 500 Index Fund", nav: 400.75, change: 1.5, holdings: [
    { name: "Apple Inc.", price: 150.25 },
    { name: "Microsoft Corp.", price: 300.50 },
    // ... (more holding companies)
  ]},
  { id: 2, name: "Fidelity Contrafund", nav: 150.20, change: -0.8, holdings: [
    { name: "Amazon.com Inc.", price: 3300.00 },
    { name: "Facebook Inc.", price: 330.25 },
    // ... (more holding companies)
  ]},
  // ... (18 more dummy mutual fund entries)
];

function StockList({ stocks, filter }) {
  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(filter.name.toLowerCase()) &&
    stock.price >= filter.minPrice &&
    stock.price <= filter.maxPrice &&
    stock.marketCap >= filter.minMarketCap &&
    stock.marketCap <= filter.maxMarketCap
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Market Cap</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredStocks.map(stock => (
          <TableRow key={stock.id}>
            <TableCell>{stock.name}</TableCell>
            <TableCell>${stock.price.toFixed(2)}</TableCell>
            <TableCell className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
              {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
            </TableCell>
            <TableCell>${stock.marketCap}B</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function MutualFundList({ funds, filter }) {
  const filteredFunds = funds.filter(fund => 
    fund.name.toLowerCase().includes(filter.name.toLowerCase()) &&
    fund.nav >= filter.minNav &&
    fund.nav <= filter.maxNav
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fund Name</TableHead>
          <TableHead>NAV</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Holdings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredFunds.map(fund => (
          <TableRow key={fund.id}>
            <TableCell>{fund.name}</TableCell>
            <TableCell>${fund.nav.toFixed(2)}</TableCell>
            <TableCell className={fund.change >= 0 ? "text-green-500" : "text-red-500"}>
              {fund.change >= 0 ? "+" : ""}{fund.change.toFixed(2)}%
            </TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Holdings</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{fund.name} Holdings</DialogTitle>
                  </DialogHeader>
                  <HoldingsTable holdings={fund.holdings} />
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function HoldingsTable({ holdings }) {
  const [filter, setFilter] = useState("");

  const filteredHoldings = holdings.filter(holding =>
    holding.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <Input
        placeholder="Filter by company name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHoldings.map((holding, index) => (
            <TableRow key={index}>
              <TableCell>{holding.name}</TableCell>
              <TableCell>${holding.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function App() {
  const [stockFilter, setStockFilter] = useState({
    name: "",
    minPrice: 0,
    maxPrice: Infinity,
    minMarketCap: 0,
    maxMarketCap: Infinity
  });

  const [fundFilter, setFundFilter] = useState({
    name: "",
    minNav: 0,
    maxNav: Infinity
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Stock Market Watchlist</h1>
      <Tabs defaultValue="stocks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="mutualfunds">Mutual Funds</TabsTrigger>
        </TabsList>
        <TabsContent value="stocks">
          <Card>
            <CardHeader>
              <CardTitle>Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Filter by name"
                  value={stockFilter.name}
                  onChange={(e) => setStockFilter({...stockFilter, name: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Min Price"
                  onChange={(e) => setStockFilter({...stockFilter, minPrice: Number(e.target.value) || 0})}
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  onChange={(e) => setStockFilter({...stockFilter, maxPrice: Number(e.target.value) || Infinity})}
                />
                <Input
                  type="number"
                  placeholder="Min Market Cap"
                  onChange={(e) => setStockFilter({...stockFilter, minMarketCap: Number(e.target.value) || 0})}
                />
              </div>
              <StockList stocks={stocks} filter={stockFilter} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mutualfunds">
          <Card>
            <CardHeader>
              <CardTitle>Mutual Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder="Filter by name"
                  value={fundFilter.name}
                  onChange={(e) => setFundFilter({...fundFilter, name: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Min NAV"
                  onChange={(e) => setFundFilter({...fundFilter, minNav: Number(e.target.value) || 0})}
                />
                <Input
                  type="number"
                  placeholder="Max NAV"
                  onChange={(e) => setFundFilter({...fundFilter, maxNav: Number(e.target.value) || Infinity})}
                />
              </div>
              <MutualFundList funds={mutualFunds} filter={fundFilter} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}