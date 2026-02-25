import { Inject, Injectable } from "@nestjs/common";
import { UploadApiResponse } from "cloudinary";
import { Multer } from "multer";
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    constructor(
        @Inject('CLOUDINARY')
        private readonly cloudinary: any
    ){}

    uploadFile(file: Express.Multer.File): Promise<UploadApiResponse>{
        return new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = this.cloudinary.uploader.upload_stream({
                folder: 'nestjs-concepts',
                resource_type: 'auto'
            },
            (error: UploadApiResponse, result: UploadApiResponse) => {
                if (error) reject(error);
                resolve(result);
            },
        );
        // Convert the file buffer into a readable stream and pipe to the upload stream 
         streamifier.createReadStream(file.buffer).pipe(uploadStream);
        })
    }

    async deleteFile(publicId: string): Promise<any> {
        return this.cloudinary.uploader.destroy(publicId);
    }
}