import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, LogOut } from 'lucide-react';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import NegoRoom from './pages/NegoRoom';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
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
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user.prenom}</span>
            <LogOut onClick={handleLogout} style={{ cursor: 'pointer' }} />
          </div>
        ) : (
          <Link to="/login" style={{ color: 'inherit' }}>
            <User />
          </Link>
        )}
        <Link to="/cart" style={{ position: 'relative' }}>
          <ShoppingCart />
          {cartItemCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: 'var(--secondary)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/nego/:id" element={<NegoRoom />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
