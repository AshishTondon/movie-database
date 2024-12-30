import cloudinary from "@/app/common/cloudinary-config";
import { NextResponse } from "next/server";

const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error at delete movie", err);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
};

export default deleteImage;
