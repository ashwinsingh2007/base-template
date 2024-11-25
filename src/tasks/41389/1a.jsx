import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Dummy data for 5 years of cryptocurrency prices
const generateDummyData = () => {
  const cryptos = ["Bitcoin", "Ethereum", "Tether", "Solana", "Binance Coin"];
  const years = [2019, 2020, 2021, 2022, 2023];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return cryptos.flatMap(crypto =>
    years.flatMap(year =>
      months.map(month => ({
        crypto,
        year,
        month,
        openPrice: Math.random() * 10000,
        closePrice: Math.random() * 10000,
        highPrice: Math.random() * 10000,
      }))
    )
  );
};

const dummyData = generateDummyData();

export default function App() {
  const [selectedYear, setSelectedYear] = useState("None");
  const [selectedMonth, setSelectedMonth] = useState("None");
  const [selectedCrypto, setSelectedCrypto] = useState("None");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    return dummyData.filter(item =>
      (selectedYear === "None" || item.year.toString() === selectedYear) &&
      (selectedMonth === "None" || item.month === selectedMonth) &&
      (selectedCrypto === "None" || item.crypto === selectedCrypto)
    );
  }, [selectedYear, selectedMonth, selectedCrypto]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const currentData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const calculatePriceChange = (openPrice, closePrice) => {
    return ((closePrice - openPrice) / openPrice) * 100;
  };

  const summaryStats = useMemo(() => {
    let bestPerforming = { crypto: '', change: -Infinity };
    let worstPerforming = { crypto: '', change: Infinity };
    let highestPrice = 0;

    filteredData.forEach(item => {
      const change = calculatePriceChange(item.openPrice, item.closePrice);
      if (change > bestPerforming.change) {
        bestPerforming = { crypto: item.crypto, change };
      }
      if (change < worstPerforming.change) {
        worstPerforming = { crypto: item.crypto, change };
      }
      if (item.highPrice > highestPrice) {
        highestPrice = item.highPrice;
      }
    });

    return { bestPerforming, worstPerforming, highestPrice };
  }, [filteredData]);

  const yearlyAverages = useMemo(() => {
    const averages = {};
    filteredData.forEach(item => {
      if (!averages[item.crypto]) {
        averages[item.crypto] = {};
      }
      if (!averages[item.crypto][item.year]) {
        averages[item.crypto][item.year] = { openSum: 0, closeSum: 0, count: 0 };
      }
      averages[item.crypto][item.year].openSum += item.openPrice;
      averages[item.crypto][item.year].closeSum += item.closePrice;
      averages[item.crypto][item.year].count += 1;
    });

    Object.keys(averages).forEach(crypto => {
      Object.keys(averages[crypto]).forEach(year => {
        const { openSum, closeSum, count } = averages[crypto][year];
        averages[crypto][year] = {
          avgOpen: openSum / count,
          avgClose: closeSum / count
        };
      });
    });

    return averages;
  }, [filteredData]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cryptocurrency Price Data</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select onValueChange={setSelectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">All Years</SelectItem>
            {[2019, 2020, 2021, 2022, 2023].map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedMonth}>
          <SelectTrigger>
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">All Months</SelectItem>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedCrypto}>
          <SelectTrigger>
            <SelectValue placeholder="Select Crypto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">All Cryptos</SelectItem>
            {["Bitcoin", "Ethereum", "Tether", "Solana", "Binance Coin"].map(crypto => (
              <SelectItem key={crypto} value={crypto}>{crypto}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Best Performing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{summaryStats.bestPerforming.crypto}: {summaryStats.bestPerforming.change.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Worst Performing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{summaryStats.worstPerforming.crypto}: {summaryStats.worstPerforming.change.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Highest Price</CardTitle>
          </CardHeader>
          <CardContent>
            <p>${summaryStats.highestPrice.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Yearly Averages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crypto</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Avg Open</TableHead>
                <TableHead>Avg Close</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(yearlyAverages).flatMap(([crypto, years]) =>
                Object.entries(years).map(([year, { avgOpen, avgClose }]) => (
                  <TableRow key={`${crypto}-${year}`}>
                    <TableCell>{crypto}</TableCell>
                    <TableCell>{year}</TableCell>
                    <TableCell>${avgOpen.toFixed(2)}</TableCell>
                    <TableCell>${avgClose.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => requestSort('crypto')}>Crypto</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Open Price</TableHead>
            <TableHead>Close Price</TableHead>
            <TableHead onClick={() => requestSort('highPrice')}>High Price</TableHead>
            <TableHead onClick={() => requestSort('priceChange')}>Price Change (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.crypto}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.month}</TableCell>
              <TableCell>${item.openPrice.toFixed(2)}</TableCell>
              <TableCell>${item.closePrice.toFixed(2)}</TableCell>
              <TableCell>${item.highPrice.toFixed(2)}</TableCell>
              <TableCell>{calculatePriceChange(item.openPrice, item.closePrice).toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}