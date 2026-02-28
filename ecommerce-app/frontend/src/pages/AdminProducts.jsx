import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const AdminProducts = () => {
	const [categories, setCategories] = useState([])
	const [selectedCategory, setSelectedCategory] = useState('')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [mrpPrice, setMrpPrice] = useState('')
	const [discountedPrice, setDiscountedPrice] = useState('')
	const [inStock, setInStock] = useState(true)
	const [images, setImages] = useState('') // comma separated URLs
	const [loading, setLoading] = useState(false)
	const [products, setProducts] = useState([])

	useEffect(() => {
		const isAdmin = localStorage.getItem('isAdmin') === 'true'
		if (!isAdmin) {
			window.location.href = '/'
			return
		}
		fetchCategories()
	}, [])

	const fetchCategories = () => {
		axios.get('http://localhost:3000/api/categories/list', {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
		})
		.then(res => setCategories(res.data.categories || []))
		.catch(err => { console.error('Failed to load categories', err); setCategories([]) })
	}

	const fetchProducts = (categoryId) => {
		if(!categoryId) return setProducts([])
		axios.get(`http://localhost:3000/api/products/list?categoryId=${categoryId}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
		})
		.then(res => setProducts(res.data.products || []))
		.catch(err => { console.error('Failed to load products', err); setProducts([]) })
	}

	const handleCategoryChange = (e) => {
		const id = e.target.value
		setSelectedCategory(id)
		fetchProducts(id)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if(!title.trim() || !description.trim() || !mrpPrice || !discountedPrice || !selectedCategory) {
			return alert('Please fill required fields: title, description, mrpPrice, discountedPrice and category')
		}
		const body = {
			title: title.trim(),
			description: description.trim(),
			mrpPrice: parseFloat(mrpPrice),
			discountedPrice: parseFloat(discountedPrice),
			categoryId: selectedCategory,
			inStock,
			images: images.split(',').map(s => s.trim()).filter(Boolean)
		}
		setLoading(true)
		axios.post('http://localhost:3000/api/products/create', body, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
		})
		.then(res => {
			alert('Product created')
			setTitle('')
			setDescription('')
			setMrpPrice('')
			setDiscountedPrice('')
			setImages('')
			fetchProducts(selectedCategory)
		})
		.catch(err => {
			console.error('Create product failed', err)
			const msg = err?.response?.data?.message || 'Failed to create product'
			alert(msg)
		})
		.finally(() => setLoading(false))
	}

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h2>Manage Products (Admin)</h2>
				<div>
					<Link to="/admin" className="btn btn-secondary me-2">Back to Dashboard</Link>
					<Link to="/admin/categories" className="btn btn-outline-secondary">Manage Categories</Link>
				</div>
			</div>

			<div className="row">
				<div className="col-md-6">
					<h4>Add Product</h4>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label">Category</label>
							<select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
								<option value="">Select category</option>
								{categories.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
							</select>
						</div>
						<div className="mb-3">
							<label className="form-label">Title</label>
							<input value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
						</div>
						<div className="mb-3">
							<label className="form-label">Description</label>
							<textarea value={description} onChange={e => setDescription(e.target.value)} className="form-control" rows={4} />
						</div>
						<div className="row">
							<div className="col-md-6 mb-3">
								<label className="form-label">MRP Price</label>
								<input type="number" step="0.01" value={mrpPrice} onChange={e => setMrpPrice(e.target.value)} className="form-control" />
							</div>
							<div className="col-md-6 mb-3">
								<label className="form-label">Discounted Price</label>
								<input type="number" step="0.01" value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)} className="form-control" />
							</div>
						</div>
						<div className="mb-3 form-check">
							<input className="form-check-input" type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} id="inStock" />
							<label className="form-check-label" htmlFor="inStock">In Stock</label>
						</div>
						<div className="mb-3">
							<label className="form-label">Images (comma separated URLs)</label>
							<input value={images} onChange={e => setImages(e.target.value)} className="form-control" />
						</div>
						<button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Product'}</button>
					</form>
				</div>

				<div className="col-md-6">
					<h4>Products in selected category</h4>
					{selectedCategory ? (
						products.length ? (
							<ul className="list-group">
								{products.map(p => (
									<li className="list-group-item" key={p._id}>
										<div className="d-flex align-items-center">
											<img src={p.images?.[0] || '/placeholder.png'} alt={p.title} style={{ width: 60, height: 60, objectFit: 'cover' }} className="me-3" />
											<div>
												<strong>{p.title}</strong>
												<div>₹{p.discountedPrice} <small className="text-muted">(MRP ₹{p.mrpPrice})</small></div>
												<div className="text-muted">{p.description?.substring(0,100)}</div>
											</div>
										</div>
									</li>
								))}
							</ul>
						) : (
							<div>No products found for this category</div>
						)
					) : (
						<div className="text-muted">Select a category to view products</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default AdminProducts
