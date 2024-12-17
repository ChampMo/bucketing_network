
import products from "../data/products";

export async function GET(request) {
  
    // ส่งข้อมูลกลับในรูปแบบ JSON
    return Response.json({
      success: true,
      data: products,
    });
  }
  