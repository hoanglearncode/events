// lib/auth.ts
import { jwtVerify, type JWTPayload as JosePayload } from "jose";

export interface JWTPayload extends JosePayload {
  userId: string;
  email: string;
  scope: string;
  status?: string;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS512"], // khớp với backend
    });

    return payload as JWTPayload;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    // ExpiredJWT, JWSInvalid, JWSSignatureVerificationFailed đều bị catch
    return null;
  }
}
