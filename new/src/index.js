import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await axios.get('/api/users');
    setUsers(response.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/users', formData);
    setFormData({ firstName: '', lastName: '', phone: '', email: '', address: '' });
    loadUsers();
  };

  return (
    <div className="App">
      <h1>User Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.firstName} {user.lastName} - {user.phone} - {user.email} - {user.address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;import { required } from 'joi';
import { get } from 'mongoose';
