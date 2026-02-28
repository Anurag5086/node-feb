import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header'
import "bootstrap/dist/css/bootstrap.min.css"
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import AdminCategory from './pages/AdminCategory'
import AdminProducts from './pages/AdminProducts'

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          {/* <Route path="/products/:id" element={<ProductDetails />} /> */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminDashboard  />} />
          <Route path="/admin/categories" element={<AdminCategory  />} />
          <Route path="/admin/products" element={<AdminProducts  />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
