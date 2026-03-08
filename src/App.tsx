import React, { useState, useRef, useEffect } from 'react';
import { 
  Leaf, 
  Upload, 
  MessageSquare, 
  X, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ChevronRight,
  Loader2,
  Droplets,
  Bug,
  ShieldCheck,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import { analyzePlantLeaf, chatWithAdvisor, type DiseaseAnalysis } from './services/gemini';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
          <Leaf className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-emerald-950">AgriScan</span>
      </div>
    </div>
  </header>
);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hello! I'm your AgriScan Advisor. How can I help you with your crops today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await chatWithAdvisor(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to advisor. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl sm:w-[400px]"
          >
            <div className="flex items-center justify-between bg-emerald-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span className="font-semibold">AgriScan Advisor</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-emerald-50/30">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    msg.role === 'user' ? "bg-emerald-600 text-white" : "bg-white text-emerald-950 border border-emerald-100"
                  )}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-emerald-100 rounded-2xl px-4 py-2 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-emerald-100 p-4 bg-white">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about farming..."
                  className="flex-1 rounded-full border border-emerald-200 bg-emerald-50/50 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const mimeType = selectedImage.split(';')[0].split(':')[1];
      const analysis = await analyzePlantLeaf(selectedImage, mimeType);
      setResult(analysis);
    } catch (err) {
      setError("Failed to analyze image. Please try again with a clearer photo.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans text-emerald-950">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Left Column: Upload & Preview */}
          <section className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-emerald-950 sm:text-5xl">
                Smart Plant <span className="text-emerald-600">Diagnosis</span>
              </h1>
              <p className="text-lg text-emerald-800/80">
                Upload a photo of your plant's leaf to detect diseases instantly and get expert treatment advice.
              </p>
            </div>

            <div 
              className={cn(
                "relative flex aspect-video w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all overflow-hidden",
                selectedImage ? "border-emerald-200 bg-white" : "border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50/50 cursor-pointer"
              )}
              onClick={() => !selectedImage && fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <>
                  <img 
                    src={selectedImage} 
                    alt="Selected leaf" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setResult(null); }}
                      className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 p-8 text-center">
                  <div className="rounded-full bg-emerald-100 p-4 text-emerald-600">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Click or drag to upload</p>
                    <p className="text-sm text-emerald-700/60">Supports JPG, PNG (Max 10MB)</p>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-6 w-6" />
                    Run Diagnosis
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700 border border-red-100">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </section>

          {/* Right Column: Results */}
          <section className="space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Summary Card */}
                  <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-emerald-100 border border-emerald-50">
                    <div className={cn(
                      "p-6 text-white flex items-center justify-between",
                      result.diseaseName.toLowerCase().includes('healthy') ? "bg-emerald-600" : "bg-amber-600"
                    )}>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Diagnosis Result</p>
                        <h2 className="text-2xl font-black">{result.diseaseName}</h2>
                        <p className="text-sm font-medium opacity-90">{result.plantType} Plant</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-3xl font-black">{(result.confidence * 100).toFixed(0)}%</div>
                        <p className="text-xs font-bold uppercase opacity-80">Confidence</p>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-1" />
                        <p className="text-emerald-900 leading-relaxed">{result.description}</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-3 rounded-2xl bg-amber-50 p-4 border border-amber-100">
                          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                            <Bug className="h-4 w-4" />
                            CAUSES
                          </div>
                          <ul className="space-y-1">
                            {result.causes.map((c, i) => (
                              <li key={i} className="text-xs text-amber-900 flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-amber-400" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3 rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                            <Droplets className="h-4 w-4" />
                            TREATMENT
                          </div>
                          <ul className="space-y-1">
                            {result.treatments.map((t, i) => (
                              <li key={i} className="text-xs text-emerald-900 flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-emerald-400" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-3 rounded-2xl bg-emerald-900 p-5 text-white shadow-lg">
                        <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                          PREVENTION TIPS
                        </div>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {result.prevention.map((p, i) => (
                            <li key={i} className="text-xs flex items-start gap-2 leading-tight">
                              <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-emerald-400" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-100 bg-emerald-50/20 p-12 text-center">
                  <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600">
                    <History className="h-12 w-12 opacity-40" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900">No Diagnosis Yet</h3>
                  <p className="mt-2 text-emerald-800/60">
                    Upload a leaf photo and run the analysis to see results here.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Features Section */}
        <section className="mt-24 grid gap-8 sm:grid-cols-3">
          {[
            { 
              icon: ShieldCheck, 
              title: "AI Precision", 
              desc: "Powered by Gemini 3.1 for state-of-the-art plant disease detection.",
              color: "bg-blue-50 text-blue-600"
            },
            { 
              icon: MessageSquare, 
              title: "Expert Advice", 
              desc: "Chat with our virtual agronomist for personalized farming tips.",
              color: "bg-purple-50 text-purple-600"
            },
            { 
              icon: Droplets, 
              title: "Sustainable Solutions", 
              desc: "Eco-friendly treatment recommendations to protect your soil health.",
              color: "bg-emerald-50 text-emerald-600"
            }
          ].map((feature, i) => (
            <div key={i} className="rounded-3xl bg-white p-8 shadow-sm border border-emerald-50 hover:shadow-md transition-shadow">
              <div className={cn("mb-4 inline-flex rounded-2xl p-3", feature.color)}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
              <p className="text-sm text-emerald-800/70 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <ChatBot />

      <footer className="mt-24 border-t border-emerald-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span className="text-lg font-bold text-emerald-950">AgriScan</span>
          </div>
          <p className="text-sm text-emerald-800/60">
            © 2026 AgriScan AI. Empowering farmers with technology.
          </p>
        </div>
      </footer>
    </div>
  );
}
