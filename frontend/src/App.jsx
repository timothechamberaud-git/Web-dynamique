import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Search, User, ShoppingCart } from 'lucide-react';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import NegoRoom from './pages/NegoRoom';
import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-brand">MERCATO NOVA.</Link>
        <div className="nav-links">
          <Link to="/catalogue">ACHETER</Link>
          <Link to="#">VENDRE</Link>
          <Link to="#">COLLECTION</Link>
          <Link to="#">AIDE</Link>
        </div>
        <div className="nav-icons">
          <Search />
          <User />
          <Link to="/cart">
            <ShoppingCart />
          </Link>
        </div>
      </nav>
      
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/nego/:id" element={<NegoRoom />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
