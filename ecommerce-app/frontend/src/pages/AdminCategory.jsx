import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Category = () => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		// Redirect non-admin users away
		const isAdmin = localStorage.getItem('isAdmin') === 'true'
		if (!isAdmin) {
			window.location.href = '/' // send non-admins to home
		} else {
			fetchCategories()
		}
	}, [])

	const fetchCategories = () => {
		axios.get('http://localhost:3000/api/categories/list', {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
		})
		.then(res => {
			setCategories(res.data.categories || [])
		})
		.catch(err => {
			console.error('Failed to fetch categories', err)
			setCategories([])
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		if(!title.trim() || !description.trim()) return alert('Both fields are required')
		setLoading(true)
		axios.post('http://localhost:3000/api/categories/create', { title, description }, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
		})
		.then(res => {
			alert('Category created')
			setTitle('')
			setDescription('')
			fetchCategories()
		})
		.catch(err => {
			console.error('Create failed', err)
			if(err.response && err.response.data && err.response.data.message) alert(err.response.data.message)
			else alert('Failed to create category')
		})
		.finally(() => setLoading(false))
	}

	return (
		<div className="container mt-4">
			<h2>Manage Categories (Admin)</h2>

			<div className="row">
				<div className="col-md-6">
					<h4>Add Category</h4>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label">Title</label>
							<input value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
						</div>
						<div className="mb-3">
							<label className="form-label">Description</label>
							<textarea value={description} onChange={e => setDescription(e.target.value)} className="form-control" rows={4} />
						</div>
						<button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create'}</button>
					</form>
				</div>

				<div className="col-md-6">
					<h4>Existing Categories</h4>
					{categories.length ? (
						<ul className="list-group">
							{categories.map(c => (
								<li className="list-group-item" key={c._id}>
									<strong>{c.title}</strong>
									<div>{c.description}</div>
								</li>
							))}
						</ul>
					) : (
						<div>No categories found</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Category
