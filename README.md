```md
# 📝 AI Text Summarizer

## 🚀 Description  
AI Text Summarizer is a web-based application that leverages **Next.js**, **Tailwind CSS**, and **OpenAI GPT** to generate concise summaries of input text. Users can enter text, upload files, and customize summary lengths to get AI-generated summaries in multiple languages.  

---

## ✨ Features  
✅ **Text Input:** Users can type or paste text for summarization.  
✅ **Summarization Button:** Click to generate AI-powered summaries.  
✅ **Summary Display:** View summarized text in real-time.  
✅ **Custom Length Options:** Choose between **Short, Medium, or Detailed** summaries.  
✅ **File Upload Support:** Upload **PDF and DOCX** files for summarization.  
✅ **Multilingual Support:** Summarize and translate text into multiple languages.  
✅ **AI-Powered Backend:** Uses OpenAI GPT API for text processing.  
✅ **API Route:** `/api/summarize.js` processes user input and returns a summary.  

---

## 📌 Prerequisites  
Ensure you have the following installed:  
- [Node.js](https://nodejs.org/) (v16 or later)  
- npm or yarn  
- A code editor (e.g., VS Code)  
- An OpenAI API key  

---

## ⚙️ Installation  

1. **Clone the Repository:**  
   ```sh
   git clone https://github.com/twriabhishek/text-Summrizer
   cd text-Summrizer
   ```

2. **Install Dependencies:**  
   ```sh
   npm install  
   # or
   yarn install
   ```

3. **Set Up Environment Variables:**  
   Create a `.env.local` file in the root directory and add:  
   ```env
   OPENAI_API_KEY=your-api-key-here
   ```

4. **Run the Development Server:**  
   ```sh
   npm run dev  
   # or
   yarn dev
   ```
   The application will be available at **http://localhost:3000**.

---

## 📖 Usage  

1. Enter or paste text into the input field.  
2. Select the desired summary length (Short, Medium, or Detailed).  
3. Click the **Summarize** button to generate the summary.  
4. Upload only **txt** .  
5. View the AI-generated summary.  
6. Optionally, choose a language for translation.  

---

## 🛠 API Endpoints  

### `POST /api/summarize.js`  

#### **Request:**  
```json
{
  "text": "Your input text here",
  "length": "short | medium | detailed",
  "language": "en | es | fr | ...",
  "file": "uploaded_file.pdf"
}
```

#### **Response:**  
```json
{
  "summary": "AI-generated summary here."
}
```

---

## 🔧 Configuration  

- **API Key:** Ensure the OpenAI API key is set in `.env.local`.  
- **Customization:** Modify styles using Tailwind CSS in `styles/globals.css`.  

---

## 🛠 Technologies Used  

- **Next.js** – React framework for server-side rendering.   
- **Tailwind CSS** – Utility-first CSS framework.  
- **OpenAI GPT API** – AI-based text summarization.  
- **Vercel** – Deployment and hosting.  

---

## 🤝 Contributing  

We welcome contributions! To contribute:  

1. Fork the repository.  
2. Create a new branch: `git checkout -b feature-branch`.  
3. Make changes and commit: `git commit -m "Added new feature"`.  
4. Push to the branch: `git push origin feature-branch`.  
5. Submit a pull request.  