'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function ExamplePage( ) {

    const [products, setProducts] = useState();

    useEffect(() => {
        // ดึงข้อมูลจาก API
        const fetchProducts = async () => {
          try {
            const response = await fetch("/api/exsort");
            const data = await response.json();
            if (data.success) {
            console.log(data.data);
              setProducts(data.data);
            }
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
    
        fetchProducts();
      }, []);
    return (
      <div className="flex justify-center min-h-screen bg-gray-100">
        <div>
            <h1>Products</h1>
            {/* ตรวจสอบว่า products มีข้อมูลหรือไม่ */}
            {products != undefined ? (
                <ul>
                {products.map((product) => (
                    <li key={product.id}>
                    {product.name} - {product.price*32} บาท
                    </li>
                ))}
                </ul>
            ) : (
                <p>Loading...</p> // แสดงข้อความขณะรอข้อมูล
            )}
        </div>
        <div>
            2
        </div>
        <div>
            3
        </div>
      </div>
    );
  }
  