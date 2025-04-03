import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ✅ Sirf TXT files allow karein
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "txt") {
      return NextResponse.json(
        { error: "File not allowed. Only TXT files are supported." },
        { status: 400 }
      );
    }

    // ✅ Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // ✅ Process TXT file
    const bytes = await file.arrayBuffer();
    const text = Buffer.from(bytes).toString("utf-8");

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error in file upload API:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}