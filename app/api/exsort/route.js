export async function POST(req) {
    try {
      // รับข้อมูลจาก Body ของ Request
      const { array } = await req.json();
      // ดึงชื่อสินค้าและราคา
      const namesAndPrices = array.map(item => ({ name: item.name, price: item.price }));
  
      // ตรวจสอบว่า array มีข้อมูลหรือไม่
      if (!Array.isArray(array) || array.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid or empty array' }), { status: 400 });
      }
  
      // เรียกใช้ Bucketing Sort
      const { sortedArray, bucketDetails } = await bucketSort(namesAndPrices);
  
      // ส่งผลลัพธ์กลับ
      return new Response(
        JSON.stringify({ sortedArray, bucketDetails }),
        { status: 200 }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  
  }
  // ฟังก์ชันสำหรับ Bucketing Sort
  async function bucketSort(namesAndPrices) {
    // คำนวณจำนวนผลิตภัณฑ์และจำนวน Buckets
    const numProducts = namesAndPrices.length;
    const numBuckets = Math.ceil(Math.sqrt(numProducts)); // จำนวน Buckets
  
    // คำนวณค่าต่ำสุดและค่าสูงสุดของราคา
    const prices = namesAndPrices.map(item => item.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
  
    // คำนวณขนาดของแต่ละ Bucket
    const bucketSize = Math.ceil((max - min) / numBuckets);
  
    // สร้าง Bucket ว่าง
    const buckets = Array.from({ length: numBuckets }, () => []);
  
    // ใส่ข้อมูลลงใน Buckets ตามราคา
    namesAndPrices.forEach(item => {
        let index = Math.floor((item.price - min) / bucketSize);
  
        // จำกัด index ให้อยู่ในช่วงที่ถูกต้อง (0 ถึง numBuckets - 1)
        if (index >= numBuckets) {
          index = numBuckets - 1; // หาก index เกินให้ใส่ bucket สุดท้าย
        }
  
        if (index >= 0 && index < numBuckets) {
          buckets[index].push(item);
        }
      });
      
    // เก็บข้อมูลของแต่ละ Bucket ก่อนการเรียง
    const bucketDetails = buckets.map(bucket => ({
      beforeSort: bucket.slice(), // ก่อนเรียง
      afterSort: bucket.sort((a, b) => a.price - b.price) // หลังเรียงตามราคา
    }));
  
  
    // จัดเรียงข้อมูลในแต่ละ Bucket ด้วย Promise.all (การประมวลผลขนาน)
    const sortedBuckets = await Promise.all(
      buckets.map(bucket => {
        return new Promise((resolve) => {
          resolve(bucket.sort((a, b) => a.price - b.price)); // ใช้ .sort() ในแต่ละ Bucket
        });
      })
    );
  
    // รวมผลลัพธ์จากทุก Bucket
    return {
      sortedArray: sortedBuckets.flat(),
      bucketDetails
    };
  }