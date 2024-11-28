import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["Vegetables", "Fruits", "Dairy", "Snacks", "Beverages"];

const generateDummyData = () => {
  const data = {};
  categories.forEach((category) => {
    data[category] = Array.from({ length: 10 }, (_, i) => ({
      id: `${category.toLowerCase()}-${i + 1}`,
      name: `${category} Item ${i + 1}`,
      price: Math.floor(Math.random() * 10) + 1,
      discount: Math.floor(Math.random() * 20),
      expiryDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      reviews: Math.floor(Math.random() * 5) + 1,
    }));
  });
  return data;
};

const dummyData = generateDummyData();

const ProductCard = ({ product, addToCart }) => (
  <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
    <CardHeader>
      <CardTitle>{product.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Price: ${product.price}</p>
      <p>Discount: {product.discount}%</p>
      <p>Expiry: {product.expiryDate}</p>
      <p>Reviews: {"⭐".repeat(product.reviews)}</p>
    </CardContent>
    <CardFooter>
      <Button onClick={() => addToCart(product)}>Add to Cart</Button>
    </CardFooter>
  </Card>
);

const ProductList = ({ products, addToCart, currentPage, setCurrentPage }) => {
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex flex-wrap">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={endIndex >= products.length}>
          Next
        </Button>
      </div>
    </div>
  );
};

const Cart = ({ cart, updateQuantity, removeFromCart, placeOrder }) => (
  <div>
    {cart.map((item) => (
      <div key={item.id} className="flex justify-between items-center mb-2">
        <span>{item.name}</span>
        <div>
          <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
          <span className="mx-2">{item.quantity}</span>
          <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
          <Button onClick={() => removeFromCart(item.id)} className="ml-2">
            Remove
          </Button>
        </div>
      </div>
    ))}
    <p>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
    <Button onClick={placeOrder}>Place Order</Button>
  </div>
);

const OrderForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, address, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <Button type="submit">Confirm Order</Button>
    </form>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const placeOrder = () => {
    setShowOrderForm(true);
  };

  const confirmOrder = (orderDetails) => {
    console.log("Order placed:", { orderDetails, cart });
    setOrderPlaced(true);
    setCart([]);
    setShowOrderForm(false);
  };

  const resetApp = () => {
    setOrderPlaced(false);
    setActiveCategory(categories[0]);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const filteredProducts = dummyData[activeCategory].filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Grocery Ordering App</h1>
      {orderPlaced ? (
        <div className="text-center">
          <h2 className="text-2xl mb-4">Order Confirmed!</h2>
          <Button onClick={resetApp}>Go back to Home</Button>
        </div>
      ) : (
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="flex flex-wrap mb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`mr-2 mb-2 ${activeCategory === category ? "bg-primary" : "bg-secondary"}`}
                >
                  {category}
                </Button>
              ))}
            </div>
            <ProductList
              products={filteredProducts}
              addToCart={addToCart}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </TabsContent>
          <TabsContent value="cart">
            {showOrderForm ? (
              <OrderForm onSubmit={confirmOrder} />
            ) : (
              <Cart
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                placeOrder={placeOrder}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}