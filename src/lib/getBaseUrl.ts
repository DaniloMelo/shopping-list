export default function getBaseUrl() {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    return "http://localhost:3000";
  }

  return process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`;
}
