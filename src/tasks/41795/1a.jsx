import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Sample initial books data
const initialBooks = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian", count: 5, price: 9.99, total_bought: 100, rating: 4.5, year: 1949, is_out_of_stock: false, availability: true },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", count: 3, price: 12.99, total_bought: 80, rating: 4.8, year: 1960, is_out_of_stock: false, availability: true },
];

export default function App() {
  const [books, setBooks] = useState(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "", yearFrom: "", yearTo: "", rating: "" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Function to handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Function to open modal for adding/editing book
  const openModal = (book = null) => {
    setCurrentBook(book);
    setIsModalOpen(true);
  };

  // Function to handle form submission in modal
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBook = Object.fromEntries(formData.entries());

    if (currentBook) {
      // Editing existing book
      setBooks(books.map((book) => (book.id === currentBook.id ? { ...book, ...newBook } : book)));
    } else {
      // Adding new book
      const existingBook = books.find((book) => book.title === newBook.title);
      if (existingBook) {
        // Increment count if book already exists
        setBooks(books.map((book) => (book.title === newBook.title ? { ...book, count: book.count + 1 } : book)));
      } else {
        // Add new book
        setBooks([...books, { ...newBook, id: books.length + 1, count: 1 }]);
      }
    }

    setIsModalOpen(false);
  };

  // Function to handle book deletion
  const handleDelete = (book) => {
    setCurrentBook(book);
    setIsDeleteConfirmOpen(true);
  };

  // Function to confirm book deletion
  const confirmDelete = () => {
    setBooks(books.filter((book) => book.id !== currentBook.id));
    setIsDeleteConfirmOpen(false);
  };

  // Function to increase book count
  const increaseCount = (id) => {
    setBooks(books.map((book) => (book.id === id ? { ...book, count: book.count + 1 } : book)));
  };

  // Function to decrease book count
  const decreaseCount = (id) => {
    setBooks(books.map((book) => (book.id === id && book.count > 0 ? { ...book, count: book.count - 1 } : book)));
  };

  // Apply filters and sorting
  const filteredAndSortedBooks = books
    .filter((book) => {
      return (
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((book) => {
      return (
        (filters.genre === "" || book.genre === filters.genre) &&
        (filters.yearFrom === "" || book.year >= parseInt(filters.yearFrom)) &&
        (filters.yearTo === "" || book.year <= parseInt(filters.yearTo)) &&
        (filters.rating === "" || book.rating >= parseFloat(filters.rating))
      );
    })
    .sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Online Library Management Dashboard</h1>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Input type="text" placeholder="Search books..." onChange={handleSearch} className="w-full sm:w-auto" />
        <Select name="genre" onChange={handleFilterChange} className="w-full sm:w-auto">
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-fiction">Non-fiction</option>
          <option value="Dystopian">Dystopian</option>
        </Select>
        <Input type="number" name="yearFrom" placeholder="Year from" onChange={handleFilterChange} className="w-full sm:w-auto" />
        <Input type="number" name="yearTo" placeholder="Year to" onChange={handleFilterChange} className="w-full sm:w-auto" />
        <Input type="number" name="rating" placeholder="Min rating" onChange={handleFilterChange} className="w-full sm:w-auto" step="0.1" min="0" max="5" />
      </div>

      {/* Add Book Button */}
      <Button onClick={() => openModal()} className="mb-4">Add New Book</Button>

      {/* Books Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort("title")}>Title</TableHead>
              <TableHead onClick={() => requestSort("author")}>Author</TableHead>
              <TableHead onClick={() => requestSort("genre")}>Genre</TableHead>
              <TableHead onClick={() => requestSort("count")}>Count</TableHead>
              <TableHead onClick={() => requestSort("price")}>Price</TableHead>
              <TableHead onClick={() => requestSort("total_bought")}>Total Bought</TableHead>
              <TableHead onClick={() => requestSort("rating")}>Rating</TableHead>
              <TableHead onClick={() => requestSort("year")}>Year</TableHead>
              <TableHead>Out of Stock</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>
                  <Button onClick={() => decreaseCount(book.id)}>-</Button>
                  {book.count}
                  <Button onClick={() => increaseCount(book.id)}>+</Button>
                </TableCell>
                <TableCell>${book.price}</TableCell>
                <TableCell>{book.total_bought}</TableCell>
                <TableCell>{book.rating}</TableCell>
                <TableCell>{book.year}</TableCell>
                <TableCell>{book.is_out_of_stock ? "Yes" : "No"}</TableCell>
                <TableCell>{book.availability ? "Available" : "Unavailable"}</TableCell>
                <TableCell>
                  <Button onClick={() => openModal(book)} className="mr-2">Edit</Button>
                  <Button onClick={() => handleDelete(book)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Book Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentBook ? "Edit Book" : "Add New Book"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input name="title" defaultValue={currentBook?.title} placeholder="Title" required className="mb-2" />
            <Input name="author" defaultValue={currentBook?.author} placeholder="Author" required className="mb-2" />
            <Input name="genre" defaultValue={currentBook?.genre} placeholder="Genre" required className="mb-2" />
            <Input name="price" type="number" defaultValue={currentBook?.price} placeholder="Price" required className="mb-2" step="0.01" />
            <Input name="year" type="number" defaultValue={currentBook?.year} placeholder="Year" required className="mb-2" />
            <Input name="rating" type="number" defaultValue={currentBook?.rating} placeholder="Rating" required className="mb-2" step="0.1" min="0" max="5" />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{currentBook?.title}"?</p>
          <DialogFooter>
            <Button onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}