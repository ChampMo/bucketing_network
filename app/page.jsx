'use client'

import { useState } from 'react';
import Link from 'next/link';
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

  const handleClear = () => {
    // เคลียร์ข้อมูลใน input และ reset state
    setArray('');
    setResult(null);
    setError(null);
  };


  return (
    <div className="min-h-screen flex flex-col items-center mt-10 px-10 pb-32">
      <div className='w-full max-w-[900px] justify-between flex items-center'>
        <div className='text-2xl mb-4'>Parallel Sorting (Bucketing)</div>
        <Link  
        href="/example" 
        className="ml-2 text-xs p-2 w-20 h-8 flex items-center justify-center bg-orange-400 text-white rounded-md cursor-pointer">
          Example
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4 mx-10 w-full flex-col">
        <div className='flex w-full justify-center'>
          <textarea
            type="text"
            value={array}
            onChange={(e) => setArray(e.target.value)}
            placeholder="Enter numbers or words separated by spaces"
            className="border p-2 text-black w-full max-w-[900px] h-32 resize-none outline-none  border-blue-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex w-full mt-5 justify-center items-center space-x-4">
          <button type="button" onClick={handleClear} className="ml-2 p-2 w-40 bg-gray-500 text-white rounded-md">Clear</button>
          <button type="submit" className="ml-2 p-2 w-40 bg-blue-500 text-white rounded-md">Sort</button>
        </div>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div className='w-full max-w-[900px]'>
          
          <div className='flex items-center space-x-2'>
            <h2 className=' font-bold'>input Array:</h2>
            <div>[{result.sortedArray.length}]</div>
          </div>
          <p>{array}</p>
          <h3 className=' font-bold'>Bucket Details:</h3>
          <div>Before Sort:</div>
          {result.bucketDetails.map((bucket, index) => (
            <div key={index} className='flex items-center space-x-4 mb-2'>
              <h4 className='w-16 shrink-0'>Bucket {index + 1}</h4>
              <p > {bucket.beforeSort.join(', ')}</p>
            </div>
          ))}
          <div>After Sort:</div>
          {result.bucketDetails.map((bucket, index) => (
            <div key={index} className='flex items-center space-x-4 mb-2'>
              <h4 className='w-16 shrink-0'>Bucket {index + 1}</h4>
              <p> {bucket.afterSort.join(', ')}</p>
            </div>
          ))}
          <h2 className=' font-bold'>Sorted Array:</h2>
          <p>{result.sortedArray.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
