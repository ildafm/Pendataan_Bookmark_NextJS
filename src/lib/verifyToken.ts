import { adminAuth } from "@/lib/firebase/firebaseAdmin";

export async function verifyAuthToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) throw new Error("Missing Authorization header");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Invalid token format");

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
