import {
    S3Client,
    PutObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get("file");
    const key = file.name;
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const title = formData.get("title");
    const description = formData.get("description");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    const bufferSizeInMB = buffer.length / (1024 * 1024);
    console.log("buffer size in MB", bufferSizeInMB);

    // multipart upload requires objects of size >= 5MB
    if (bufferSizeInMB < 5) {
        try {
            // single
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: file.name,
                Body: buffer,
                ContentType: file.type,
            });

            const response = await client.send(command);

            return NextResponse.json(
                {
                    message: `File of size ${bufferSizeInMB}MB uploaded successfully`,
                },
                { status: 200 }
            );
        } catch (err) {
            return NextResponse.json(
                { error: `Failed to upload file of size ${bufferSizeInMB}MB` },
                { status: 500 }
            );
        }
    } else {
        let uploadId;
        try {
            // multipart
            const multipartUpload = await client.send(
                new CreateMultipartUploadCommand({
                    Bucket: bucket,
                    Key: key,
                })
            );

            uploadId = multipartUpload.UploadId;

            const uploadPromises = [];

            const partSize = 5 * 1024 * 1024; // 5MB
            const parts = Math.ceil(buffer.length / partSize);

            for (let part = 0; part < parts; part++) {
                const start = part * partSize;
                const end = start + partSize;
                uploadPromises.push(
                    client
                        .send(
                            new UploadPartCommand({
                                Bucket: bucket,
                                Key: key,
                                UploadId: uploadId,
                                Body: buffer.subarray(start, end),
                                PartNumber: part + 1,
                            })
                        )
                        .then((d) => {
                            console.log("Part", part + 1, "uploaded");
                            return d;
                        })
                );
            }

            const uploadResults = await Promise.all(uploadPromises);

            const response = await client.send(
                new CompleteMultipartUploadCommand({
                    Bucket: bucket,
                    Key: key,
                    UploadId: uploadId,
                    MultipartUpload: {
                        Parts: uploadResults.map(({ ETag }, i) => ({
                            ETag,
                            PartNumber: i + 1,
                        })),
                    },
                })
            );

            return NextResponse.json(
                {
                    message: `File of size ${bufferSizeInMB}MB uploaded successfully`,
                },
                { status: 200 }
            );
        } catch (err) {
            console.error(err);

            if (uploadId) {
                const abortCommand = new AbortMultipartUploadCommand({
                    Bucket: bucket,
                    Key: key,
                    UploadId: uploadId,
                });

                await client.send(abortCommand);
            }
            return NextResponse.json(
                { error: `Failed to upload file of size ${bufferSizeInMB}MB` },
                { status: 500 }
            );
        }
    }
}
