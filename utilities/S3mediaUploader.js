const s3Client = require('../config/s3');
const fs = require('fs');
const path = require('path');
const { PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

// TODO: Migrate to signed URLs
const buildS3ObjectUrl = (key) =>
  `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

exports.buildS3ObjectUrl = buildS3ObjectUrl;

exports.s3ObjectExists = async (key) => {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: key }));
    return true;
  } catch (error) {
    if (error?.name === 'NotFound' || error?.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
};

exports.uploadMediaToS3 = async (file, folder = 'extras', filename = null, height = null, quality = null) => {
  try {
    const fileBuffer = fs.readFileSync(file.tempFilePath);
    const extension = path.extname(file.name);
    // const finalFileName = filename
    //   ? `${folder}/${filename}_${Date.now()}${extension}`
    //   : `${folder}/${Date.now()}${extension}`;

    const finalFileName = filename
      ? `${folder}/${filename}${extension}`
      : `${folder}/${Date.now()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: finalFileName,
      Body: fileBuffer,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    });

    await s3Client.send(command);
    const url = buildS3ObjectUrl(finalFileName);

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
