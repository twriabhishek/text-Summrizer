"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, FileText, Sparkles, Upload, FileUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Languages supported for translation and summarization
const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
]

export default function TextSummarizer() {
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [summaryLength, setSummaryLength] = useState("medium")
  const [outputLanguage, setOutputLanguage] = useState("en")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileName, setFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter some text to summarize")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          summaryLength,
          outputLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize text")
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      setError("An error occurred while summarizing the text. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)
    setError("")
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()
      setText(data.text)
    } catch (err) {
      setError("An error occurred while uploading the file. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
      setUploadProgress(0)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Text Summarizer</h1>
          <p className="text-muted-foreground">
            Paste your lengthy text, upload a file, or enter a URL to get a concise AI-generated summary
          </p>
        </div>

        <Tabs defaultValue="text" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">
              <FileText className="mr-2 h-4 w-4" />
              Text Input
            </TabsTrigger>
            <TabsTrigger value="file">
              <Upload className="mr-2 h-4 w-4" />
              File Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card>
              <CardHeader>
                <CardTitle>Input Text</CardTitle>
                <CardDescription>Enter or paste the text you want to summarize</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your text here (minimum 100 characters recommended for better results)"
                  className="min-h-[200px]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {text ? `${text.length} characters` : "No text entered"}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>Upload a PDF or document file to summarize its content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="file">File</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="w-full h-32 flex flex-col gap-2"
                    >
                      <FileUp className="h-8 w-8" />
                      <span>Click to upload</span>
                      <span className="text-xs text-muted-foreground">Supports PDF, DOCX, TXT (max 10MB)</span>
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                  </div>
                  {fileName && <div className="text-sm mt-2">Selected file: {fileName}</div>}
                  {uploadProgress > 0 && (
                    <div className="w-full mt-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <div className="text-xs text-right mt-1">{uploadProgress}%</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Summarization Options</CardTitle>
            <CardDescription>Customize how you want your text to be summarized</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Summary Length</Label>
                <RadioGroup
                  defaultValue="medium"
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short">Short (1-2 paragraphs)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium (2-3 paragraphs)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="detailed" id="detailed" />
                    <Label htmlFor="detailed">Detailed (3+ paragraphs)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Output Language</Label>
                <Select value={outputLanguage} onValueChange={setOutputLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSummarize} disabled={loading || !text.trim()} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Summarize
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-6">{error}</div>}

        {summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Summary
              </CardTitle>
              <CardDescription>AI-generated summary of your text</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">{summary}</div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(summary)
                }}
              >
                Copy to Clipboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  )
}

