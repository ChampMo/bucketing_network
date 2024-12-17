'use client'

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [array, setArray] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // แปลง input เป็น array ของตัวเลข
      const values = array.split(' ').map((item) => item.trim());
      
      // ตรวจสอบว่า input เป็นตัวเลขทั้งหมดหรือไม่
      const isNumbers = values.every((value) => !isNaN(value));
      console.log(values);
      console.log(isNumbers);
      // เลือก API endpoint ตามประเภทของข้อมูล (ตัวเลขหรือข้อความ)
      const endpoint = isNumbers ? '/api/sort' : '/api/sorttext';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array: values }), // ส่งข้อมูลไปในรูปแบบ array ของตัวเลขหรือตัวหนังสือ
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setResult(data);
        setError(null);
      } else {
        setError(data.error);
        setResult(null);
      }
    } catch (err) {
      setError('An error occurred: ' + err.message);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1>Parallel Sorting (Bucketing)</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={array}
          onChange={(e) => setArray(e.target.value)}
          placeholder="Enter numbers or words separated by spaces"
          className="border p-2 text-black"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white">Sort</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div>
          <h2>Sorted Array:</h2>
          <p>{result.sortedArray.join(', ')}</p>

          <h3>Bucket Details:</h3>
          {result.bucketDetails.map((bucket, index) => (
            <div key={index}>
              <h4>Bucket {index + 1}</h4>
              <p><strong>Before Sort:</strong> {bucket.beforeSort.join(', ')}</p>
              <p><strong>After Sort:</strong> {bucket.afterSort.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}