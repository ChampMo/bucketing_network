export async function POST(req) {
  try {
    // รับข้อมูลจาก Body ของ Request
    const { array } = await req.json();
    console.log(array);
    // ตรวจสอบว่า words มีข้อมูลหรือไม่
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
  const numBuckets = 26; // จำนวน Buckets ที่จะใช้ (หนึ่ง Bucket สำหรับแต่ละตัวอักษร A-Z)
  
  // สร้าง Bucket ว่าง
  const buckets = Array.from({ length: numBuckets }, () => []);

  // ใส่คำลงใน Buckets ตามตัวอักษรแรก
  array.forEach(word => {
    const firstLetter = word[0].toUpperCase(); // ใช้ตัวอักษรแรก
    const index = firstLetter.charCodeAt(0) - 'A'.charCodeAt(0); // คำนวณตำแหน่งของตัวอักษร A-Z
    if (index >= 0 && index < numBuckets) {
      buckets[index].push(word);
    }
  });

  // เก็บข้อมูลของแต่ละ Bucket ก่อนการเรียง
  const bucketDetails = buckets.map(bucket => ({
    beforeSort: bucket.slice(), // ก่อนเรียง
    afterSort: bucket.sort() // หลังเรียง
  }));

  console.log(bucketDetails);
  // รวมผลลัพธ์จากทุก Bucket
  return {
    sortedArray: buckets.flat(),
    bucketDetails
  };
}
