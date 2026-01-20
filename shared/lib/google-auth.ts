import {
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
} from "@/shared/config/google.config";

/**
 * Generate Google OAuth authentication link
 */
/**
 * Google OAuth callback parameters interface
 */
export interface GoogleCallbackParams {
  code: string;
  scope: string;
  authuser: string;
  prompt: string;
}
