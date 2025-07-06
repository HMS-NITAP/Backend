const s3Client = require('../config/s3');
const fs = require('fs');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

exports.uploadMediaToS3 = async (file, folder = 'extras', filename = null, height = null, quality = null) => {
  try {
    const fileBuffer = fs.readFileSync(file.tempFilePath);
    const extension = path.extname(file.name);
    const finalFileName = filename
      ? `${folder}/${filename}_${Date.now()}${extension}`
      : `${folder}/${Date.now()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: finalFileName,
      Body: fileBuffer,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    });

    await s3Client.send(command);
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${finalFileName}`;
    console.log("URL")

    return {
      success: true,
      url,
      key: finalFileName,
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};
