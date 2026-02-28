import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCartFromLocalStorage } from '../utils/cartUtils'

const Header = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))
	const [cartCount, setCartCount] = useState(
		getCartFromLocalStorage().reduce((sum, item) => sum + (item.quantity || 1), 0)
	)
	const navigate = useNavigate()

	useEffect(() => {
		// Keep login state in sync (useful when other pages update localStorage)
		const onStorage = () => setIsLoggedIn(!!localStorage.getItem('token'))
		window.addEventListener('storage', onStorage)
		return () => window.removeEventListener('storage', onStorage)
	}, [])

	useEffect(() => {
		// Poll cart in localStorage so header shows an updated count within the same tab
		const updateCart = () => {
			const count = getCartFromLocalStorage().reduce((sum, item) => sum + (item.quantity || 1), 0)
			setCartCount(count)
		}
		updateCart()
		const id = setInterval(updateCart, 1000)
		return () => clearInterval(id)
	}, [])

	const handleLogout = () => {
		localStorage.removeItem('token')
		setIsLoggedIn(false)
		navigate('/login')
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 px-3 py-2">
			<div className="container">
				<Link className="navbar-brand" to="/">Acciozon</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon" />
				</button>

				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink className="nav-link" to="/">Shop</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/orders">My Orders</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/cart">Cart {cartCount > 0 && <span className="badge bg-secondary ms-1">{cartCount}</span>}</NavLink>
						</li>
					</ul>

					<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
						{isLoggedIn ? (
							<li className="nav-item">
								<button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
							</li>
						) : (
							<>
								<li className="nav-item">
									<NavLink className="nav-link" to="/login">Login</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" to="/register">Register</NavLink>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default Header

