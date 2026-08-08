import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '1234567890';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'your_cloudinary_api_secret_here';

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export interface SignedUploadParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  publicId: string;
  type: string;
  resourceType: string;
}

export function generateUploadSignature(
  studentId: string,
  assessmentId: string,
  questionNumber: number
): SignedUploadParams {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = `assessments/${studentId}/${assessmentId}`;
  const publicId = `q${questionNumber}_${timestamp}`;
  const type = 'authenticated'; // Mark asset as authenticated/private
  const resourceType = 'video';

  // Parameters to sign (alphabetical order as required by Cloudinary API)
  const paramsToSign = {
    folder,
    public_id: publicId,
    timestamp,
    type,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder,
    publicId,
    type,
    resourceType,
  };
}

export function generateSignedPlaybackUrl(publicId: string, durationSec: number = 3600): string {
  const expiresAt = Math.floor(Date.now() / 1000) + durationSec;

  try {
    // Generate signed authenticated URL for private video streaming
    const signedUrl = cloudinary.utils.private_download_url(publicId, 'webm', {
      resource_type: 'video',
      type: 'authenticated',
      expires_at: expiresAt,
    });
    return signedUrl;
  } catch (err) {
    // Fallback URL generation with sign_url option
    const url = cloudinary.url(publicId, {
      resource_type: 'video',
      type: 'authenticated',
      sign_url: true,
      expires_at: expiresAt,
      secure: true,
    });
    return url;
  }
}
