import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Table, 
  TableHeader, 
  TableBody, 
  TableColumn, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Dummy data for cryptocurrencies over 5 years
const dummyData = Array.from({ length: 60 }, (_, i) => ({
  year: 2019 + Math.floor(i / 12),
  month: (i % 12) + 1,
  Bitcoin: { open: 3000 + i * 100, close: 3050 + i * 102, high: 3100 + i * 105 },
  Ethereum: { open: 100 + i * 10, close: 105 + i * 11, high: 120 + i * 12 },
  Tether: { open: 1, close: 1, high: 1.01 },
  Solana: { open: 2 + i * 0.2, close: 2.1 + i * 0.21, high: 2.5 + i * 0.25 },
  BinanceCoin: { open: 6 + i * 0.5, close: 6.2 + i * 0.51, high: 6.5 + i * 0.55 },
}));

function App() {
  const [yearFilter, setYearFilter] = useState('None');
  const [monthFilter, setMonthFilter] = useState('None');
  const [cryptoFilter, setCryptoFilter] = useState('None');
  
  const filteredData = useMemo(() => {
    return dummyData.filter(d => 
      (yearFilter === 'None' || d.year == yearFilter) &&
      (monthFilter === 'None' || d.month == monthFilter) &&
      (cryptoFilter === 'None' || ['Bitcoin', 'Ethereum', 'Tether', 'Solana', 'BinanceCoin'].includes(cryptoFilter))
    );
  }, [yearFilter, monthFilter, cryptoFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const sortData = (key) => {
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = cryptoFilter === 'None' ? a[cryptoFilter] ? a[cryptoFilter][key] : 0 : a[cryptoFilter][key];
      const valueB = cryptoFilter === 'None' ? b[cryptoFilter] ? b[cryptoFilter][key] : 0 : b[cryptoFilter][key];
      return valueB - valueA;
    });
    // Here you would typically update state with sorted data, but for simplicity:
    console.log(`Sorted by ${key}`, sorted.slice(0, 10)); // Log first 10 for demonstration
  };

  const calculatePerformance = (data, crypto) => {
    const totalChange = data.reduce((acc, curr) => 
      acc + ((curr[crypto].close - curr[crypto].open) / curr[crypto].open * 100), 0);
    return totalChange / data.length;
  };

  const summaryStats = useMemo(() => {
    const allCryptos = ['Bitcoin', 'Ethereum', 'Tether', 'Solana', 'BinanceCoin'];
    let best = { name: '', performance: -Infinity };
    let worst = { name: '', performance: Infinity };
    let highestHigh = 0;

    allCryptos.forEach(crypto => {
      const performance = calculatePerformance(filteredData, crypto);
      if (performance > best.performance) {
        best = { name: crypto, performance };
      }
      if (performance < worst.performance) {
        worst = { name: crypto, performance };
      }
      filteredData.forEach(d => {
        if (d[crypto].high > highestHigh) highestHigh = d[crypto].high;
      });
    });

    return { best, worst, highestHigh };
  }, [filteredData]);

  const yearlyAverages = useMemo(() => {
    const averages = {};
    ['Bitcoin', 'Ethereum', 'Tether', 'Solana', 'BinanceCoin'].forEach(crypto => {
      averages[crypto] = Array.from({ length: 5 }, (_, i) => {
        const yearData = filteredData.filter(d => d.year === 2019 + i);
        const openSum = yearData.reduce((sum, d) => sum + d[crypto].open, 0);
        const closeSum = yearData.reduce((sum, d) => sum + d[crypto].close, 0);
        return {
          year: 2019 + i,
          avgOpen: openSum / yearData.length,
          avgClose: closeSum / yearData.length
        };
      });
    });
    return averages;
  }, [filteredData]);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Cryptocurrency Price Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <Select onValueChange={setYearFilter}>
              <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                {[...Array(5)].map((_, i) => <SelectItem key={i} value={2019 + i}>{2019 + i}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={setMonthFilter}>
              <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                {[...Array(12)].map((_, i) => <SelectItem key={i} value={i + 1}>{i + 1}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={setCryptoFilter}>
              <SelectTrigger><SelectValue placeholder="Select Crypto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Tether">Tether</SelectItem>
                <SelectItem value="Solana">Solana</SelectItem>
                <SelectItem value="BinanceCoin">Binance Coin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <p>Best Performing: {summaryStats.best.name} ({summaryStats.best.performance.toFixed(2)}%)</p>
            <p>Worst Performing: {summaryStats.worst.name} ({summaryStats.worst.performance.toFixed(2)}%)</p>
            <p>Highest High: ${summaryStats.highestHigh.toFixed(2)}</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableColumn onClick={() => sortData('open')}>Year/Month</TableColumn>
                <TableColumn onClick={() => sortData('open')}>Crypto Name</TableColumn>
                <TableColumn onClick={() => sortData('open')}>Open</TableColumn>
                <TableColumn onClick={() => sortData('close')}>Close</TableColumn>
                <TableColumn onClick={() => sortData('high')}>High</TableColumn>
                <TableColumn onClick={() => sortData('high')}>Price Change (%)</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((data, index) => 
                Object.keys(data).filter(key => key !== 'year' && key !== 'month').map((crypto, cryptoIndex) => (
                  <TableRow key={`${index}-${cryptoIndex}`}>
                    <TableCell>{data.year}/{data.month}</TableCell>
                    <TableCell>{crypto}</TableCell>
                    <TableCell>${data[crypto].open.toFixed(2)}</TableCell>
                    <TableCell>${data[crypto].close.toFixed(2)}</TableCell>
                    <TableCell>${data[crypto].high.toFixed(2)}</TableCell>
                    <TableCell>{(((data[crypto].close - data[crypto].open) / data[crypto].open) * 100).toFixed(2)}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>Previous</Button>
            <span>Page {currentPage}</span>
            <Button onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredData.length / rowsPerPage)))}>Next</Button>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Yearly Averages</h2>
            {Object.entries(yearlyAverages).map(([crypto, years]) => (
              <div key={crypto} className="mb-4">
                <h3>{crypto}</h3>
                {years.map(year => (
                  <p key={year.year}>Year {year.year}: Avg Open ${year.avgOpen.toFixed(2)}, Avg Close ${year.avgClose.toFixed(2)}</p>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;