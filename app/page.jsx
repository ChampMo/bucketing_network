'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // เรียก API เมื่อ Component โหลด
    async function fetchData() {
      try {
        const response = await axios.get('/api/data'); // เรียก API ด้วย Axios
        setApiData(response.data); // เก็บข้อมูลจาก API ใน state
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {apiData && (
        <div>
          <h1>{apiData.message}</h1>
          <ul>
            {apiData.data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
