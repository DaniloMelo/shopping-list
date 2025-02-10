export default function getBaseUrl() {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    return "http://localhost:3000";
  }

  return `https://${process.env.VERCEL_URL}`;
}
