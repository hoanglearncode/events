export const pusherConfig = {
  cluster: "ap1",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  authEndpoint: process.env.NEXT_PUBLIC_AUTH_PUSHER + "/broadcasting/auth",
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "",
  wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
  wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
  forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
};
