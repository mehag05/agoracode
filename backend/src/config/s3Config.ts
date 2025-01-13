import dotenv from 'dotenv';
import { Express, Request } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    key: (req: Request, file: Express.Multer.File, cb: (err: any, key: string) => void) => {
      const fileName = `products/${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      cb(null, fileName);
    },
  }),
});

export default upload;