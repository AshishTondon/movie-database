import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { NextRequest, NextResponse } from "next/server";
import { Readable } from 'stream';
import cloudinary from "@/app/common/cloudinary-config";

const convertReaderToReadStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    readStream: Readable
  ) => {
    while (true) {
      const { done, value } = await reader.read();
  
      if (done) {
        // Stream reading complete
        readStream.push(null);
        break;
      }
  
      // Process the chunk of data
      readStream.push(value);
    }
  };

const uploadToCloudinary = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as unknown as File;
    const title = formData.get("title");
    const year = formData.get("year");

    const readableStream = file.stream();

    const reader = readableStream.getReader();

    const readStream = new Readable({
      read() {
        console.log("read");
      },
    });

    const promise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ 
            resource_type: 'auto', 
            folder: "movie-database",
            context: {
                title, year
            }
        }, (error?: UploadApiErrorResponse, result?:UploadApiResponse) => {
            if (error) {
              console.log(error);
              reject({ error: 'Error uploading to Cloudinary' });
            }
            resolve({ public_id: result?.public_id, url: result?.secure_url });
        });
    
        convertReaderToReadStream(reader, readStream)
          .then(() => readStream.pipe(uploadStream))
          .catch((err) => {
            console.log("readStream", err);
        });
    });

    const result = await promise;

    return NextResponse.json(result, { status: 200 });
  } catch(err) {
    console.error("Error at delete movie", err);

    return NextResponse.json({message: "Internal server error."}, { status: 500 });
  }    
};

export default uploadToCloudinary;