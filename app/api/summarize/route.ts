import OpenAI from "openai"; 
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in .env.local
});

export async function POST(req: Request) {
  try {
    const { text, summaryLength, outputLanguage } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Please provide text to summarize" }, { status: 400 });
    }

    let lengthInstruction = "";
    switch (summaryLength) {
      case "short":
        lengthInstruction = "Create a very concise summary in 1-2 short paragraphs.";
        break;
      case "medium":
        lengthInstruction = "Create a balanced summary in 2-3 paragraphs.";
        break;
      case "detailed":
        lengthInstruction = "Create a comprehensive summary in 3 or more paragraphs that captures more details.";
        break;
      default:
        lengthInstruction = "Create a balanced summary in 2-3 paragraphs.";
    }

    let languageInstruction = "";
    if (outputLanguage && outputLanguage !== "en") {
      const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
      const languageName = languageNames.of(outputLanguage);
      languageInstruction = `Translate the summary to ${languageName}.`;
    }

    // Use OpenAI's API correctly
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: `Summarize the following text:\n\n${text}\n\n${lengthInstruction}\n${languageInstruction}` }],
    });

    const summary = response.choices[0]?.message?.content || "No summary generated.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error in summarize API:", error);
    return NextResponse.json({ error: "Failed to summarize text" }, { status: 500 });
  }
}
