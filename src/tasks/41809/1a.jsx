import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Input, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";

const initialStocks = [
  { id: 1, name: 'TechCorp', price: 150.23, change: 2.34, marketCap: '1.2T' },
  { id: 2, name: 'GreenEnergy', price: 50.45, change: -1.02, marketCap: '450B' },
  // ... Add 18 more stocks here for a total of 20
];

const initialUserBalance = 10000;

function App() {
  const [stocks, setStocks] = useState(initialStocks);
  const [userBalance, setUserBalance] = useState(initialUserBalance);
  const [ownedStocks, setOwnedStocks] = useState([]);
  const [filter, setFilter] = useState({ search: '', sortBy: 'name', order: 'asc' });
  const [currentTab, setCurrentTab] = useState('market');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({ action: '', stock: null });

  const filteredAndSortedStocks = stocks
    .filter(stock => stock.name.toLowerCase().includes(filter.search.toLowerCase()))
    .sort((a, b) => {
      const order = filter.order === 'asc' ? 1 : -1;
      if (filter.sortBy === 'price') return order * (a.price - b.price);
      return order * a[filter.sortBy].localeCompare(b[filter.sortBy]);
    });

  const handleSort = (column) => {
    setFilter(prev => ({
      ...prev,
      sortBy: column,
      order: prev.sortBy === column && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBuy = (stock) => {
    setDialogContent({ action: 'buy', stock });
    setDialogOpen(true);
  };

  const handleSell = (stock) => {
    setDialogContent({ action: 'sell', stock });
    setDialogOpen(true);
  };

  const confirmAction = (action) => {
    const stock = dialogContent.stock;
    if (action === 'buy' && userBalance >= stock.price) {
      setOwnedStocks(prev => [...prev, { ...stock, quantity: 1 }]);
      setUserBalance(userBalance - stock.price);
    } else if (action === 'sell' && ownedStocks.some(s => s.id === stock.id)) {
      const updatedStocks = ownedStocks.map(s => 
        s.id === stock.id ? { ...s, quantity: s.quantity + 1 } : s
      );
      setOwnedStocks(updatedStocks);
      setUserBalance(userBalance + stock.price);
    }
    setDialogOpen(false);
  };

  return (
    <div className="p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Stock Market Simulator</CardTitle>
          <CardDescription>Your balance: ${userBalance.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => setCurrentTab('market')}>Market</Button>
            <Button onClick={() => setCurrentTab('portfolio')}>Portfolio</Button>
          </div>

          {currentTab === 'market' && (
            <div>
              <Input 
                placeholder="Search stocks..." 
                className="mb-4"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell onClick={() => handleSort('name')}>Name</TableCell>
                    <TableCell onClick={() => handleSort('price')}>Price</TableCell>
                    <TableCell>Change</TableCell>
                    <TableCell>Market Cap</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedStocks.map(stock => (
                    <TableRow key={stock.id}>
                      <TableCell>{stock.name}</TableCell>
                      <TableCell>${stock.price.toFixed(2)}</TableCell>
                      <TableCell className={stock.change > 0 ? 'text-green-600' : 'text-red-600'}>
                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                      </TableCell>
                      <TableCell>{stock.marketCap}</TableCell>
                      <TableCell><Button onClick={() => handleBuy(stock)}>Buy</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {currentTab === 'portfolio' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ownedStocks.map(stock => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>${stock.price.toFixed(2)}</TableCell>
                    <TableCell><Button onClick={() => handleSell(stock)}>Sell</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {dialogContent.action === 'buy' ? 'Purchase' : 'Sale'}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => confirmAction(dialogContent.action)}>Confirm</Button>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;