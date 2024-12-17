export async function GET(req) {
    // สร้าง Response สำหรับ Method GET
    return Response.json({ message: 'Hello from API!', data: [1, 2, 3, 4] });
  }
  