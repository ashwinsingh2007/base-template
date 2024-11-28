// Importing necessary React hooks and components for the app
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define product categories, including "All" as the default category
const categories = ["All", "Vegetables", "Fruits", "Dairy", "Snacks", "Beverages"];

// Generate dummy product data for each category
const generateDummyData = () => {
  const data = {};
  categories.forEach((category) => {
    if (category !== "All") {
      data[category] = Array.from({ length: 10 }, (_, i) => ({
        id: `${category.toLowerCase()}-${i + 1}`, // Unique product ID
        name: `${category} Item ${i + 1}`, // Product name
        price: Math.floor(Math.random() * 10) + 1, // Random price between 1 and 10
        discount: Math.floor(Math.random() * 20), // Random discount percentage
        expiryDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Random expiry date
          .toISOString()
          .split("T")[0],
        reviews: Math.floor(Math.random() * 5) + 1, // Random number of reviews (1-5 stars)
      }));
    }
  });
  return data;
};

// Generate the initial dummy data
const dummyData = generateDummyData();

// Component to render individual product cards
const ProductCard = ({ product, addToCart }) => (
  <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
    <CardHeader>
      <CardTitle>{product.name}</CardTitle> {/* Product name */}
    </CardHeader>
    <CardContent>
      <p>Price: ${product.price}</p> {/* Product price */}
      <p>Discount: {product.discount}%</p> {/* Product discount */}
      <p>Expiry: {product.expiryDate}</p> {/* Product expiry date */}
      <p>Reviews: {"⭐".repeat(product.reviews)}</p> {/* Display star reviews */}
    </CardContent>
    <CardFooter>
      <Button onClick={() => addToCart(product)}>Add to Cart</Button> {/* Add to cart button */}
    </CardFooter>
  </Card>
);

// Component to render the list of products with pagination
const ProductList = ({ products, addToCart, currentPage, setCurrentPage }) => {
  const itemsPerPage = 5; // Number of items per page
  const startIndex = (currentPage - 1) * itemsPerPage; // Start index for current page
  const endIndex = startIndex + itemsPerPage; // End index for current page
  const displayedProducts = products.slice(startIndex, endIndex); // Products for current page

  return (
    <div>
      <div className="flex flex-wrap">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
      {/* Pagination buttons */}
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

// Component to render the shopping cart
const Cart = ({ cart, updateQuantity, removeFromCart, placeOrder }) => (
  <div>
    {cart.length === 0 ? (
      <p>Your cart is empty.</p> // Show empty cart message
    ) : (
      cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>{item.name}</span> {/* Item name */}
          <div>
            {/* Buttons to adjust quantity and remove items */}
            <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
            <span className="mx-2">{item.quantity}</span>
            <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
            <Button onClick={() => removeFromCart(item.id)} className="ml-2">
              Remove
            </Button>
          </div>
        </div>
      ))
    )}
    {/* Total cart value */}
    <p>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
    <Button onClick={placeOrder} disabled={cart.length === 0}>
      Place Order
    </Button>
  </div>
);

// Form to collect user details for order placement
const OrderForm = ({ onSubmit }) => {
  const [name, setName] = useState(""); // Customer name
  const [address, setAddress] = useState(""); // Customer address
  const [phone, setPhone] = useState(""); // Customer phone

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, address, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input fields for customer details */}
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <Button type="submit">Confirm Order</Button> {/* Submit button */}
    </form>
  );
};

// Main application component
export default function App() {
  const [activeCategory, setActiveCategory] = useState(categories[0]); // Active category filter
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const [cart, setCart] = useState([]); // Items in cart
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [orderPlaced, setOrderPlaced] = useState(false); // Order confirmation state
  const [showOrderForm, setShowOrderForm] = useState(false); // Show order form state

  // Function to add items to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Update quantity if item already exists in cart
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Add new item to cart
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Function to update item quantity in the cart
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(id); // Remove item if quantity is zero
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  // Function to remove item from the cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Function to initiate order placement
  const placeOrder = () => {
    setShowOrderForm(true);
  };

  // Function to confirm order and reset states
  const confirmOrder = (orderDetails) => {
    console.log("Order placed:", { orderDetails, cart }); // Log order details
    setOrderPlaced(true);
    setCart([]); // Clear the cart
    setShowOrderForm(false); // Hide the order form
  };

  // Reset application state after order confirmation
  const resetApp = () => {
    setOrderPlaced(false);
    setActiveCategory(categories[0]);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // Filter products based on search term and active category
  const filteredProducts =
    activeCategory === "All"
      ? Object.values(dummyData).flat().filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : dummyData[activeCategory].filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto p-4">
      {/* App title */}
      <h1 className="text-3xl font-bold mb-4">Grocery Ordering App</h1>
      {orderPlaced ? (
        // Display order confirmation screen
        <div className="text-center">
          <h2 className="text-2xl mb-4">Order Confirmed!</h2>
          <Button onClick={resetApp}>Go back to Home</Button>
        </div>
      ) : (
        // Tabs to toggle between product list and cart
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            {/* Search bar */}
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            {/* Category filter buttons */}
            <div className="flex flex-wrap mb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`mr-2 mb-2 ${activeCategory === category ? "bg-black" : "bg-black"}`}
                >
                  {category}
                </Button>
              ))}
            </div>
            {/* Render product list */}
            <ProductList
              products={filteredProducts}
              addToCart={addToCart}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </TabsContent>
          <TabsContent value="cart">
            {showOrderForm ? (
              // Show order form if order is being placed
              <OrderForm onSubmit={confirmOrder} />
            ) : (
              // Show cart details
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
