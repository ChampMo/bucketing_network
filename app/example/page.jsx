'use client'

import "../globals.css";
import { useState, useEffect } from 'react';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';


export default function ExamplePage( ) {

    const [products, setProducts] = useState();
    const [isChecked, setIsChecked] = useState(false); // สร้าง state สำหรับ checkbox

    const [result, setResult] = useState(null);
    const [title, setTitle] = useState('Select a sorting method');
    const [newProductName, setNewProductName] = useState(null);
    const [newProductPrice, setNewProductPrice] = useState(null);

    const handleCheckboxChange = (e) => {
      setIsChecked(e.target.checked); // อัปเดตสถานะจากการกด checkbox
    }
    useEffect(() => {
        // ดึงข้อมูลจาก API
        const fetchProducts = async () => {
          try {
            const response = await fetch("/api/data");
            const data = await response.json();
            if (data.success) {
            
              setProducts(data.data);
            }
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
    
        fetchProducts();
      }, []);

        const handleshuffle = () => {
            const shuffle = () => {
                const array = products.slice();
                for (let i = array.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [array[i], array[j]] = [array[j], array[i]];
                }
                setProducts(array);
              };
              return shuffle;
        }

        const resetResult = () => {
            setResult(null);
            setTitle('Select a sorting method');
        }


    const sortProduct = async () => {
        try {
            // ส่งข้อมูลไปที่ backend (สามารถปรับ URL เป็น API ที่ต้องการ)
            const response = await fetch("/api/exsorttext", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ array:products }),  // ส่ง products ไปใน body
            });

            const result = await response.json();
            console.log(result);

            if (result) {
            console.log("Data successfully sent!");
            setResult(result);
            setTitle('Products sort by name');
            } else {
            console.error("Failed to send data:", result.message);
            }
        } catch (error) {
            console.error("Error sending products:", error);
        }
        };




    const sortPrice = async () => {
        try {
            // ส่งข้อมูลไปที่ backend (สามารถปรับ URL เป็น API ที่ต้องการ)
            const response = await fetch("/api/exsort", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ array:products }),  // ส่ง products ไปใน body
            });

            const result = await response.json();
            console.log(result);

            if (result) {
            console.log("Data successfully sent!");
            setResult(result);
            setTitle('Products sort by price');
            } else {
            console.error("Failed to send data:", result.message);
            }
        } catch (error) {
            console.error("Error sending products:", error);
        }
        };
        

    const handleAddProduct = () => {
        // ตรวจสอบว่ามีค่าชื่อและราคา
        if (newProductName.trim() !== "" && newProductPrice !== "") {
            const newProduct = {
            name: newProductName,
            price: parseFloat(newProductPrice), // แปลงเป็น number
            };
            setProducts([newProduct, ...products]); // ใส่ newProduct เป็นตัวแรกใน array
            setNewProductName(""); // เคลียร์ช่อง Name
            setNewProductPrice(""); // เคลียร์ช่อง Price
        }
        };
        
    return (
      <div className="flex justify-center min-h-screen px-5 bg-gray-100">
        <div>
            <h1 className="my-5 text-xl font-bold flex justify-between"> 
                <div>Products</div>
                <Icon onClick={handleshuffle()} 
                className=" cursor-pointer" 
                icon="lets-icons:sort-random-light" width="24" height="24" />
            </h1>
            <div className=" text-sm">Add item</div>
            <div className="flex justify-between my-2 gap-1">
                <input 
                placeholder="Name"
                value={newProductName} // ผูกค่า state กับ value ของ input
                onChange={(e) => setNewProductName(e.target.value)} // อัปเดต state
                className="w-32 rounded-md px-2 outline-none focus:ring-1 focus:ring-blue-500"/>
                <input 
                type="number"
                placeholder="Price"
                value={newProductPrice} // ผูกค่า state กับ value ของ input
                onChange={(e) => setNewProductPrice(e.target.value)} // อัปเดต state
                className="w-32 rounded-md px-2 outline-none focus:ring-1 focus:ring-blue-500"/>
                <div 
                onClick={handleAddProduct}
                className=" w-14 h-7 items-center bg-blue-500 flex justify-center rounded-md text-white cursor-pointer text-sm">Add</div>
            </div>
            <div className='bg-white px-4 rounded-lg shadow-md h-[740px] overflow-y-auto max-w-96 w-full slide'>
                {products != undefined ? (
                    <ul>
                    {products.map((product) => (
                        <>
                            <li key={product.id} className='flex justify-between my-4 gap-2'>
                            <div>{product.name}</div> <div>{product.price} บาท</div>
                            </li>
                            <div className='w-full h-[1px] bg-slate-300'></div>
                        </>
                    ))}
                    </ul>
                ) : (
                    <p className="w-40 flex justify-center mt-5">Loading...</p> // แสดงข้อความขณะรอข้อมูล
                )}
            </div>
            
        </div>
        <div className="flex flex-col items-center justify-center gap-3 mx-5">
            <div className="flex">Bucket
            <div class="checkbox-wrapper-63 scale-75">
                <label class="switch">
                    <input 
                    checked={isChecked} 
                    onChange={handleCheckboxChange}
                    type="checkbox"/>
                    <span class="slider"></span>
                </label>
                </div>
            </div>
            <div 
            onClick={sortProduct}
            className="flex w-32 justify-center h-10 rounded-md bg-blue-500 text-white items-center cursor-pointer">Sort by name</div>
            <div 
            onClick={sortPrice}
            className="flex w-32 justify-center h-10 rounded-md bg-blue-500 text-white items-center cursor-pointer">Sort by price</div>
            <div 
            onClick={resetResult}
            className="flex w-32 justify-center h-10 rounded-md bg-gray-500 text-white items-center cursor-pointer">Reset</div>
        </div>
        <div>
        <h1 className="my-5 text-xl font-bold">{title}</h1>
            <div className='bg-white px-4 rounded-lg shadow-md h-[800px] overflow-y-auto max-w-96 w-full slide'>
                {result != null ? 
                (isChecked?(
                      <ul>
                        {result.bucketDetails.map((bucket, index) => (
                            <div key={index}>
                            {/* วนลูป beforeSort ที่เป็น Array */}
                            {/* <div className="w-full h-[1px] bg-blue-500"></div> */}
                            <div className="flex items-center justify-center w-20 space-x-4 mb-2 bg-blue-500 text-white rounded-b-lg">
                                bucket {index + 1}
                            </div>
                            {bucket.beforeSort.map((item, idx) => (
                                <div key={idx}>
                                <li className="flex justify-between my-4 gap-2">
                                    <div>{item.name}</div>
                                    <div>{item.price} บาท</div>
                                </li>
                                <div className="w-full h-[1px] bg-slate-300"></div>
                                </div>
                            ))}
                            </div>
                        ))}
                        </ul>
                ) :
                (
                    <ul>
                    {result.sortedArray.map((item, index) => (
                        <>
                            <li key={index} className='flex justify-between my-4 gap-2'>
                            <div>{item.name}</div> <div>{item.price} บาท</div>
                            </li>
                            <div className='w-full h-[1px] bg-slate-300'></div>
                        </>
                    ))}
                    </ul>
                )
                )
                : (
                    <p className="w-72 flex justify-center mt-5"></p> // แสดงข้อความขณะรอข้อมูล
                )}
            </div>
        </div>
        
      </div>

      
    );
  }
  