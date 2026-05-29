import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingCart, LogOut, Bell, Shield } from 'lucide-react';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import NegoRoom from './pages/NegoRoom';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Vendre from './pages/Vendre';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { getNotifications, markNotificationsAsRead } from './services/api';

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) {
      const fetchNotifs = async () => {
        const res = await getNotifications(user.id);
        if (res && res.status === 'success') {
          setNotifs(res.data);
        }
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  const unreadCount = notifs.filter(n => !n.Lu).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNotifClick = async () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      await markNotificationsAsRead(user.id);
      setNotifs(notifs.map(n => ({...n, Lu: true})));
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">MERCATO NOVA.</Link>
      <div className="nav-links">
        <Link to="/catalogue">ACHETER</Link>
        <Link to="/dashboard">VENDRE</Link>
        <Link to="#">COLLECTION</Link>
        <Link to="#">AIDE</Link>
      </div>
      <div className="nav-icons">
        <Search />
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            
            {/* ADMIN ICON */}
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'inherit' }} title="Admin Dashboard">
                <Shield />
              </Link>
            )}

            {/* NOTIFICATIONS */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <div style={{ cursor: 'pointer', position: 'relative' }} onClick={handleNotifClick}>
                <Bell />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#d93838',
                    color: 'white', fontSize: '0.6rem', fontWeight: 'bold', borderRadius: '50%',
                    width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              
              {showNotifs && (
                <div style={{
                  position: 'absolute', top: '150%', right: '0', width: '300px', backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 100,
                  maxHeight: '400px', overflowY: 'auto', border: '1px solid #e1e8ed'
                }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid #e1e8ed', fontWeight: 'bold' }}>Notifications</div>
                  {notifs.length === 0 ? (
                    <div style={{ padding: '15px', color: '#8fa0a8', textAlign: 'center' }}>Aucune notification.</div>
                  ) : (
                    notifs.map(n => (
                      <Link to={n.Lien || '#'} key={n.NumNotif} onClick={() => setShowNotifs(false)}
                            style={{ display: 'block', padding: '15px', borderBottom: '1px solid #f1f3f5', color: '#111424',
                                     textDecoration: 'none', backgroundColor: n.Lu ? 'white' : '#f5f8fa' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 'bold', marginBottom: '5px' }}>
                          {n.TypeNotif}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>{n.Contenu}</div>
                        <div style={{ fontSize: '0.7rem', color: '#8fa0a8', marginTop: '5px' }}>
                          {new Date(n.DateNotif).toLocaleString()}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer' }}>{user.prenom}</span>
            </Link>
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
      <Routes>
        {/* L'admin dashboard a sa propre vue sans la navbar standard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={
          <>
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vendre" element={<Vendre />} />
              </Routes>
            </main>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
