import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge } from "@/components/ui";

// Dummy data for products
const dummyData = {
  vegetables: [...Array(10)].map((_, i) => ({
    name: `Vegetable ${i+1}`, price: (Math.random() * 10 + 1).toFixed(2), discount: Math.floor(Math.random() * 10), 
    expiry: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    reviews: Math.floor(Math.random() * 5) + 1
  })),
  // Similarly for fruits, dairy, snacks, beverages
};

function ProductCard({ product, onAdd }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>Price: ${product.price} <Badge variant="secondary">-{product.discount}%</Badge></CardDescription>
      </CardHeader>
      <CardContent>
        <p>Expiry: {product.expiry}</p>
        <p>Rating: {product.reviews} stars</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAdd(product)}>+ Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('vegetables');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [orderInfo, setOrderInfo] = useState({ name: '', address: '', phone: '' });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const categories = Object.keys(dummyData);
  const products = dummyData[selectedCategory].filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === product.name);
      if (existingItem) {
        return prevCart.map(item => 
          item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productName) => {
    setCart(prevCart => prevCart.filter(item => item.name !== productName));
  };

  const updateQuantity = (productName, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => item.name === productName ? { ...item, quantity: quantity } : item)
    );
  };

  const placeOrder = () => {
    if (orderInfo.name && orderInfo.address && orderInfo.phone) {
      setIsOrderPlaced(true);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
        <Button onClick={() => { setIsOrderPlaced(false); setCart([]); setOrderInfo({ name: '', address: '', phone: '' }); }}>Go back to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Input 
        placeholder="Search for products..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-4"
      />
      <div className="flex flex-wrap mb-4">
        {categories.map(category => (
          <Button 
            key={category} 
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => {setSelectedCategory(category); setCurrentPage(1);}}
            className="m-2"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map(product => (
          <ProductCard key={product.name} product={product} onAdd={addToCart} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {[...Array(Math.ceil(products.length / itemsPerPage)).keys()].map(number => (
          <Button key={number} onClick={() => paginate(number + 1)} className="mx-1">
            {number + 1}
          </Button>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        {cart.map(item => (
          <div key={item.name} className="flex justify-between items-center mb-2">
            <span>{item.name} x {item.quantity}</span>
            <div>
              <Button onClick={() => removeFromCart(item.name)}>Remove</Button>
              <Input 
                type="number" 
                value={item.quantity} 
                onChange={(e) => updateQuantity(item.name, parseInt(e.target.value))} 
                className="w-16 ml-2"
              />
            </div>
          </div>
        ))}
        <p>Total: ${cart.reduce((sum, item) => sum + (item.price * (1 - item.discount/100) * item.quantity), 0).toFixed(2)}</p>
        {cart.length > 0 && (
          <div className="mt-4">
            <Input placeholder="Name" value={orderInfo.name} onChange={(e) => setOrderInfo({...orderInfo, name: e.target.value})} />
            <Input placeholder="Address" value={orderInfo.address} onChange={(e) => setOrderInfo({...orderInfo, address: e.target.value})} />
            <Input placeholder="Phone" value={orderInfo.phone} onChange={(e) => setOrderInfo({...orderInfo, phone: e.target.value})} />
            <Button onClick={placeOrder} className="mt-2">Place Order</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;