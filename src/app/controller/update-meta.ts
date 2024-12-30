import cloudinary from "@/app/common/cloudinary-config";
import { NextResponse, NextRequest } from "next/server";

const updateMeta = async (request: NextRequest) => {
    const { title, year, id } = await request.json()

    try {
      const result = await cloudinary.api.update(
        id.replaceAll("%2F", "/"),
        {
          context: { title, year }
        }
      );

      return NextResponse.json(result, { status: 200 });
    } catch(err) {
      console.error("Error at update movie", err);

      return NextResponse.json({message: "Internal server error."}, { status: 500 });
    }
    
}

export default updateMeta;