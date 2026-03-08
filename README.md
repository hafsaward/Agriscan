# AgriScan 🌿

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_3.1_Flash-orange.svg)](https://ai.google.dev/)

**AgriScan** is a professional-grade, AI-powered web application designed to empower farmers and agricultural professionals with instant plant disease diagnosis and expert agronomic advice. By leveraging state-of-the-art multimodal Large Language Models (LLMs), AgriScan bridges the gap between advanced computer vision and practical field application.

---

## 🚀 Key Features

### 1. Intelligent Disease Diagnosis
*   **Multimodal Vision Analysis**: Utilizes Gemini 3.1 Flash to analyze high-resolution leaf imagery.
*   **Instant Identification**: Detects thousands of plant species and specific pathological conditions (fungal, bacterial, viral, or nutrient-based).
*   **Confidence Scoring**: Provides a probabilistic certainty index for every diagnosis to ensure data-driven decision-making.

### 2. Agronomic Insight Engine
*   **Root Cause Analysis**: Detailed breakdown of environmental and biological factors contributing to the infection.
*   **Sustainable Treatment Protocols**: Eco-friendly and effective chemical/organic treatment recommendations.
*   **Preventative Strategy**: Actionable steps to mitigate future outbreaks and improve soil health.

### 3. AgriScan AI Advisor
*   **Conversational Interface**: A persistent virtual agronomist capable of answering complex farming queries.
*   **Contextual Support**: Provides personalized advice on irrigation, fertilization, and crop management.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS 4.0 (Mobile-First) |
| **Animations** | Framer Motion |
| **AI Engine** | Google Gemini 3.1 Flash (Multimodal) |
| **Icons** | Lucide React |

---

## 📦 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   A Google AI Studio API Key ([Get it here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agriscan.git
   cd agriscan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

AgriScan is optimized for deployment on **Vercel** or **Netlify**.

1. Connect your GitHub repository to Vercel.
2. Add `GEMINI_API_KEY` to the **Environment Variables** section in the Vercel dashboard.
3. Deploy.

---

## 📐 Architecture

AgriScan follows a modern **Single Page Application (SPA)** architecture with a direct integration to the Gemini API via the `@google/genai` SDK.

*   **`src/services/gemini.ts`**: Handles all API orchestration, prompt engineering, and response parsing.
*   **`src/App.tsx`**: Manages global state, image processing, and the primary user interface.
*   **`src/components/`**: Modularized UI components for high maintainability.

---

