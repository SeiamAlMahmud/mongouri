"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const CreateDatabaseForm = () => {
  const [dbName, setDbName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [databaseCount, setDatabaseCount] = useState(null);

  // Fetch total database count when the component mounts
  useEffect(() => {
    const fetchDatabaseCount = async () => {
      try {
        const response = await axios.get('/api/getDatabases');
        setDatabaseCount(response.data.databaseCount);
      } catch (err) {
        console.error("Error fetching database count:", err);
      }
    };
    fetchDatabaseCount();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/createDatabase', { dbName, userName, password });
      setMessage(response.data.message);
      setError('');
      // After creating the database, update the database count
      fetchDatabaseCount();
    } catch (err) {
      setError(err);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Create a MongoDB Database and User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={dbName}
          onChange={(e) => setDbName(e.target.value)}
          placeholder="Enter database name"
          required
        />
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
        <button type="submit">Create</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {databaseCount !== null && (
        <p>Total Databases: {databaseCount}</p>
      )}
    </div>
  );
};

export default CreateDatabaseForm;
