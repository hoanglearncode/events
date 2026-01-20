import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // Validate environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Missing Cloudinary credentials:", {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret,
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = Math.floor(Date.now() / 1000);

    // Generate signature
    const signature = crypto
      .createHash("sha1")
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    // Prepare form data for Cloudinary
    const cloudinaryForm = new FormData();
    cloudinaryForm.append(
      "file",
      new Blob([buffer], { type: file.type }),
      file.name
    );
    cloudinaryForm.append("api_key", apiKey);
    cloudinaryForm.append("timestamp", timestamp.toString());
    cloudinaryForm.append("signature", signature);

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryForm,
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Cloudinary API error:", {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });
      return NextResponse.json(
        { error: "Failed to upload to Cloudinary", details: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
