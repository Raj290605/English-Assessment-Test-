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

export function generateSignedPlaybackUrl(publicId: string | null | undefined, durationSec: number = 3600): string | null {
  if (!publicId) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + durationSec;

  // Generate a signed authenticated URL suitable for HTML5 <video> playback.
  // We use cloudinary.url with sign_url: true instead of private_download_url
  // to prevent browsers from forcing an attachment download.
  // Using .mp4 allows Cloudinary to transcode WebM on the fly, ensuring iOS compatibility.
  const publicIdWithExt = publicId.includes('.') ? publicId : `${publicId}.mp4`;
  
  const url = cloudinary.url(publicIdWithExt, {
    resource_type: 'video',
    type: 'authenticated',
    sign_url: true,
    expires_at: expiresAt,
    secure: true,
  });
  
  return url;
}
