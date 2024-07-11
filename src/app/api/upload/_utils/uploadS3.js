import {
    S3Client,
    PutObjectCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";

import { awsConfig } from "../../../../../utils/auth";

const s3client = new S3Client(awsConfig);

export default async function uploadS3(user_id, created_at, file) {
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const key = `${user_id}___${created_at}___.${file.name.split(".").pop()}`;
    const path = `audio/${key}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bufferSizeInMB = buffer.length / (1024 * 1024);
    console.log("buffer size in MB", bufferSizeInMB);

    // multipart upload requires objects of size >= 5MB
    if (bufferSizeInMB < 5) {
        try {
            // single
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: path,
                Body: buffer,
                ContentType: file.type,
            });

            await s3client.send(command);

            return {
                message: `File of size ${bufferSizeInMB}MB uploaded successfully`,
            };
        } catch (err) {
            return {
                error: `Failed to upload file of size ${bufferSizeInMB}MB`,
            };
        }
    } else {
        let uploadId;
        try {
            // multipart
            const multipartUpload = await s3client.send(
                new CreateMultipartUploadCommand({
                    Bucket: bucket,
                    Key: path,
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
                    s3client
                        .send(
                            new UploadPartCommand({
                                Bucket: bucket,
                                Key: path,
                                UploadId: uploadId,
                                Body: buffer.subarray(start, end),
                                PartNumber: part + 1,
                            })
                        )
                        .then((d) => {
                            console.log(
                                `Part ${part + 1} uploaded / ${parts} total`
                            );
                            return d;
                        })
                );
            }

            const uploadResults = await Promise.all(uploadPromises);

            await s3client.send(
                new CompleteMultipartUploadCommand({
                    Bucket: bucket,
                    Key: path,
                    UploadId: uploadId,
                    MultipartUpload: {
                        Parts: uploadResults.map(({ ETag }, i) => ({
                            ETag,
                            PartNumber: i + 1,
                        })),
                    },
                })
            );

            return {
                message: `File of size ${bufferSizeInMB}MB uploaded successfully`,
            };
        } catch (err) {
            console.error(err);

            if (uploadId) {
                const abortCommand = new AbortMultipartUploadCommand({
                    Bucket: bucket,
                    Key: path,
                    UploadId: uploadId,
                });

                await s3client.send(abortCommand);
            }
            return {
                error: `Failed to upload file of size ${bufferSizeInMB}MB`,
            };
        }
    }
}
