'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';


export default function ExamplePage( ) {

    const [products, setProducts] = useState();

    useEffect(() => {
        // ดึงข้อมูลจาก API
        const fetchProducts = async () => {
          try {
            const response = await fetch("/api/data");
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
            <div className='bg-white p-4 rounded-lg shadow-md h-[800px] overflow-y-auto w-96'>
                {products != undefined ? (
                    <ul>
                    {products.map((product) => (
                        <>
                            <li key={product.id} className='flex justify-between my-4'>
                            <div>{product.name}</div> <div>{product.price*32} บาท</div>
                            </li>
                            <div className='w-full h-[1px] bg-slate-300'></div>
                        </>
                    ))}
                    </ul>
                ) : (
                    <p>Loading...</p> // แสดงข้อความขณะรอข้อมูล
                )}
            </div>
            
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
  