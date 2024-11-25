
import React, { useState, useMemo } from "react";

// Importing custom UI components (Tables, Cards, Buttons, Select dropdowns)
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

// Generates dummy data for 5 years of cryptocurrency prices
const generateDummyData = () => {
  const cryptos = ["Bitcoin", "Ethereum", "Tether", "Solana", "Binance Coin"];
  const years = [2019, 2020, 2021, 2022, 2023];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Creates data for each crypto for every year and month with random price values
  return cryptos.flatMap(crypto =>
    years.flatMap(year =>
      months.map(month => ({
        crypto,
        year,
        month,
        openPrice: Math.random() * 10000, // Random open price
        closePrice: Math.random() * 10000, // Random close price
        highPrice: Math.random() * 10000, // Random high price
      }))
    )
  );
};

const dummyData = generateDummyData(); // Generate initial dataset

export default function App() {
  // State variables
  const [selectedYear, setSelectedYear] = useState("None"); // Selected year filter
  const [selectedMonth, setSelectedMonth] = useState("None"); // Selected month filter
  const [selectedCrypto, setSelectedCrypto] = useState("None"); // Selected cryptocurrency filter
  const [currentPage, setCurrentPage] = useState(1); // Current page number for pagination
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Sorting configuration

  const rowsPerPage = 10; // Number of rows per page

  // Filters the dummy data based on the selected filters
  const filteredData = useMemo(() => {
    return dummyData.filter(item =>
      (selectedYear === "None" || item.year.toString() === selectedYear) &&
      (selectedMonth === "None" || item.month === selectedMonth) &&
      (selectedCrypto === "None" || item.crypto === selectedCrypto)
    );
  }, [selectedYear, selectedMonth, selectedCrypto]);

  // Sorts the filtered data based on sort configuration
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

  // Paginate the sorted data
  const currentData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / rowsPerPage); // Total number of pages

  // Function to toggle sorting based on column key
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Calculates percentage price change between open and close prices
  const calculatePriceChange = (openPrice, closePrice) => {
    return ((closePrice - openPrice) / openPrice) * 100;
  };

  // Calculates summary statistics (best and worst performers, highest price)
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

  // Calculates yearly average open and close prices for each cryptocurrency
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

  // JSX rendering the application UI
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cryptocurrency Price Data</h1>

      {/* Dropdown filters */}
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

      {/* Summary stats */}
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

      {/* Yearly averages table */}
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

      {/* Paginated data table */}
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

      {/* Pagination controls */}
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


