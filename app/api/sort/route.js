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
  const numBuckets = 5; // จำนวน Bucket
  const min = Math.min(...array);
  const max = Math.max(...array);
  const bucketSize = Math.ceil((max - min + 1) / numBuckets);

  // สร้าง Bucket
  const buckets = Array.from({ length: numBuckets }, () => []);

  // ใส่ข้อมูลลงใน Buckets
  array.forEach(num => {
    const index = Math.floor((num - min) / bucketSize);
    buckets[index].push(num);
  });

  const bucketDetails = buckets.map(bucket => ({
    beforeSort: bucket.slice(),
    afterSort: bucket.sort((a, b) => a - b)
  }));

  const sortedBuckets = await Promise.all(
    buckets.map(bucket => {
      return new Promise((resolve) => {
        resolve(bucket.sort((a, b) => a - b));
      });
    })
  );

  return {
    sortedArray: sortedBuckets.flat(),
    bucketDetails
  };
}
