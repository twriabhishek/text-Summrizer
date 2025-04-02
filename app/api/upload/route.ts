import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import * as pdfjs from "pdfjs-dist"
import type { TextItem } from "pdfjs-dist/types/src/display/api"

// Set worker path for PDF.js
const pdfjsWorker = join(process.cwd(), "node_modules", "pdfjs-dist", "build", "pdf.worker.js")
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    // Process file based on type
    let text = ""

    if (fileExtension === "pdf") {
      // Process PDF file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Save temporarily to process
      const tempFilePath = join("/tmp", `upload-${Date.now()}.pdf`)
      await writeFile(tempFilePath, buffer)

      // Extract text from PDF
      const pdfDocument = await pdfjs.getDocument(tempFilePath).promise

      // Extract text from each page
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item) => (item as TextItem).str).join(" ")
        text += pageText + "\n"
      }
    } else if (fileExtension === "txt") {
      // Process text file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      text = buffer.toString("utf-8")
    } else if (fileExtension === "docx") {
      // For DOCX, we'd normally use a library like mammoth.js
      // For simplicity in this example, we'll return an error
      return NextResponse.json({ error: "DOCX processing is not implemented in this example" }, { status: 400 })
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 },
      )
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error in file upload API:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}

