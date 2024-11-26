import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Checkbox } from "@/components/ui/checkbox";
import { useDisclosure } from "@/components/ui/use-disclosure";

const initialBooks = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian", count: 10, price: 15, totalBought: 100, rating: 4.5, year: 1949, isOutOfStock: false },
  // Add more books here...
];

function App() {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({});

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredBooks = books.filter(book => 
    Object.values(book).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleAddOrEditBook = () => {
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { ...formData, id: b.id } : b));
    } else {
      const newBook = { ...formData, id: Date.now() };
      const existingBook = books.find(book => book.title.toLowerCase() === newBook.title.toLowerCase());
      if (existingBook) {
        setBooks(books.map(book => book.id === existingBook.id ? { ...book, count: book.count + 1 } : book));
      } else {
        setBooks([...books, newBook]);
      }
    }
    onClose();
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({...book});
    onOpen();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  return (
    <div className="container mx-auto p-4">
      <Input 
        type="text" 
        placeholder="Search books..." 
        value={search} 
        onChange={handleSearch} 
        className="mb-4"
      />
      <Card>
        <CardHeader>
          <CardTitle>Library Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map(book => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.count}</TableCell>
                  <TableCell>${book.price}</TableCell>
                  <TableCell>{book.rating}</TableCell>
                  <TableCell>{book.year}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(book)}>Edit</Button>
                    <Button onClick={() => handleDelete(book.id)} className="ml-2">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={onOpen}>Add Book</Button>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{editingBook ? 'Edit Book' : 'Add New Book'}</ModalHeader>
              <ModalBody>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} />
                {/* Add more fields similarly */}
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleAddOrEditBook}>Save</Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;