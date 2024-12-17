'use client'

import "../globals.css";
import { useState, useEffect } from 'react';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';


export default function ExamplePage( ) {

    const [products, setProducts] = useState();
    const [isChecked, setIsChecked] = useState(false); // สร้าง state สำหรับ checkbox

    const [result, setResult] = useState(null);
    const [title, setTitle] = useState(null);

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
            console.log('------------',result);

            if (result) {
            console.log("Data successfully sent!");
            setResult(result);
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
            } else {
            console.error("Failed to send data:", result.message);
            }
        } catch (error) {
            console.error("Error sending products:", error);
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
            <div className='bg-white px-4 rounded-lg shadow-md h-[800px] overflow-y-auto max-w-96 w-full slide'>
                {products != undefined ? (
                    <ul>
                    {products.map((product) => (
                        <>
                            <li key={product.id} className='flex justify-between my-4 gap-2'>
                            <div>{product.name}</div> <div>{product.price*32} บาท</div>
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
        <h1 className="my-5 text-xl font-bold">---</h1>
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
                                    <div>{item.price * 32} บาท</div>
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
                            <div>{item.name}</div> <div>{item.price*32} บาท</div>
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
  