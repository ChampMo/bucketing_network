export async function POST(req) {
    try {
      // รับข้อมูลจาก Body ของ Request
      const { array } = await req.json();
    console.log(array);
      // ตรวจสอบว่า array มีข้อมูลหรือไม่
      if (!Array.isArray(array) || array.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid or empty array' }), { status: 400 });
      }
  
      // เรียกใช้ Bucketing Sort
      const { sortedArray, bucketDetails } = await bucketSort(array);
  
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
  async function bucketSort(array) {
    const numBuckets = 5; // จำนวน Bucket ที่จะใช้ในการจัดเรียง
    const min = Math.min(...array);
    const max = Math.max(...array);
    const bucketSize = Math.ceil((max - min + 1) / numBuckets);
  
    // สร้าง Bucket ว่าง
    const buckets = Array.from({ length: numBuckets }, () => []);
  
    // ใส่ข้อมูลลงใน Buckets
    array.forEach(num => {
      const index = Math.floor((num - min) / bucketSize);
      buckets[index].push(num);
    });
  
    // เก็บข้อมูลของแต่ละ Bucket ก่อนการเรียง
    const bucketDetails = buckets.map(bucket => ({
      beforeSort: bucket.slice(), // ก่อนเรียง
      afterSort: bucket.sort((a, b) => a - b) // หลังเรียง
    }));
  
    // จัดเรียงข้อมูลในแต่ละ Bucket ด้วย Promise.all (การประมวลผลขนาน)
    const sortedBuckets = await Promise.all(
      buckets.map(bucket => {
        return new Promise((resolve) => {
          resolve(bucket.sort((a, b) => a - b)); // ใช้ .sort() ในแต่ละ Bucket
        });
      })
    );
  
    // รวมผลลัพธ์จากทุก Bucket
    return {
      sortedArray: sortedBuckets.flat(),
      bucketDetails
    };
  }
  