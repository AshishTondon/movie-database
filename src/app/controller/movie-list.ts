import cloudinary from "@/app/common/cloudinary-config";
import { NextResponse } from "next/server";

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  context?: {
    custom?: {
      [key: string]: string;
    };
  };
  // Add any other properties you expect from the resource
}

const getImageList = async (page?: string | null) => {
  try {
    const list = await cloudinary.api
      .resources({
        folder: "movie-database",
        context: true,
        resource_type: "image",
        type: "upload",
        max_results: 20,
        ...(page && { next_cursor: page }),
      })
      .then(
        ({
          resources,
          next_cursor,
        }: {
          resources: Array<CloudinaryResource>;
          next_cursor: string;
        }) => ({
          list: resources.map(({ public_id, context, secure_url }) => ({
            url: secure_url,
            title: context?.custom?.title,
            year: context?.custom?.year,
            id: public_id,
          })),
          nextPage: next_cursor,
        }),
      );

    return NextResponse.json(list, { status: 200 });
  } catch (err) {
    console.error("Error at delete movie", err);

    return NextResponse.json(
      { message: "Internal server error.", list: [] },
      { status: 500 },
    );
  }
};

export default getImageList;
