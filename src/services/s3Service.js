import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configure your S3 client
const s3Client = new S3Client({
  region: 'us-east-1', // Update to your region
  credentials: {
    accessKeyId: process.env.VUE_APP_ACCESS_KEY || '', // Use environment variables in production
    secretAccessKey: process.env.VUE_APP_SECRET_ACCESS_KEY || '',
  }
});

export const uploadToS3 = async (file, quizID) => {
  try {
    // Construct the folder path and file key
    const fileName = `${Date.now()}_${file.name}`;
    const key = `quizzes/${quizID}/${fileName}`;

    const params = {
      Bucket: 'pgpccawsgauravwadile', // Replace with your bucket name
      Key: key,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read'
    };
    
    const response = await s3Client.send(new PutObjectCommand(params));
    // Return the URL of the uploaded file
    return `https://${params.Bucket}.s3.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
