'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Palette, Sparkles, ChevronLeft, ChevronRight, X, Loader2, AlertCircle } from 'lucide-react';

const DEMO_LIMIT = 3;
const STORAGE_KEY = 'visionary-demo-count';

const styles = [
  { id: 'modern', name: 'Modern', color: 'from-slate-600 to-slate-800' },
  { id: 'minimalist', name: 'Minimalist', color: 'from-gray-500 to-gray-700' },
  { id: 'industrial', name: 'Industrial', color: 'from-amber-700 to-stone-800' },
  { id: 'scandinavian', name: 'Scandinavian', color: 'from-amber-100 to-stone-300' },
  { id: 'bohemian', name: 'Bohemian', color: 'from-orange-400 to-pink-500' },
  { id: 'mid-century', name: 'Mid-Century', color: 'from-amber-500 to-teal-600' },
  { id: 'coastal', name: 'Coastal', color: 'from-sky-400 to-blue-600' },
  { id: 'rustic', name: 'Rustic', color: 'from-amber-600 to-stone-700' },
];

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Upload',
    description: 'Drop your room photo',
    icon: <Upload className="w-5 h-5" />,
  },
  {
    id: 2,
    title: 'Choose Style',
    description: 'Pick a design style',
    icon: <Palette className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Generate',
    description: 'Watch the magic happen',
    icon: <Sparkles className="w-5 h-5" />,
  },
];

function BeforeAfterSlider({
  beforeImage,
  afterImage
}: {
  beforeImage: string;
  afterImage: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden cursor-col-resize select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* Before image (full width) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <span className="text-sm text-slate-500">Original Room</span>
          </div>
        </div>
      </div>

      {/* After image (clipped) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-cyan-900/50"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto text-emerald-400 mb-2" />
            <span className="text-sm text-emerald-400">AI Redesigned</span>
          </div>
        </div>
      </div>

      {/* Slider handle */}
      <div
        className="absolute inset-y-0 w-1 bg-white cursor-col-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-slate-600 -mr-1" />
          <ChevronRight className="w-4 h-4 text-slate-600 -ml-1" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white">
        Before
      </div>
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 backdrop-blur-sm text-xs text-white">
        After
      </div>
    </div>
  );
}

export function DemoSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [demoCount, setDemoCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load demo count from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setDemoCount(parseInt(stored, 10));
    }
  }, []);

  const remainingDemos = DEMO_LIMIT - demoCount;
  const canGenerate = remainingDemos > 0;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setCurrentStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    setCurrentStep(3);
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);

    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Update demo count
    const newCount = demoCount + 1;
    setDemoCount(newCount);
    localStorage.setItem(STORAGE_KEY, newCount.toString());

    setIsGenerating(false);
    setShowResult(true);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedStyle(null);
    setUploadedImage(null);
    setShowResult(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" id="demo">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-950" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

      <div className="relative max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Try it yourself.{' '}
            <span className="gradient-text">Free, no sign-up required.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            See the power of AI-driven design in action. Upload a room photo and
            transform it instantly.
          </p>

          {/* Demo limit indicator */}
          <motion.div
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-1">
              {Array.from({ length: DEMO_LIMIT }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < remainingDemos
                      ? 'bg-emerald-500'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">
              {remainingDemos} free {remainingDemos === 1 ? 'demo' : 'demos'} remaining
            </span>
          </motion.div>
        </motion.div>

        {/* Progress steps */}
        <div className="flex justify-center gap-4 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30'
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="hidden sm:block">
                  <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-white' : 'text-slate-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-colors ${
                    currentStep > step.id
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                      : 'bg-slate-700'
                  }`}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Demo area */}
        <motion.div
          className="glass rounded-2xl p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {currentStep === 1 && !showResult && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                >
                  <motion.div
                    className="p-4 rounded-full bg-slate-800 group-hover:bg-emerald-500/20 transition-colors mb-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </motion.div>
                  <p className="text-slate-300 font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose Style */}
            {currentStep === 2 && !showResult && (
              <motion.div
                key="style"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Choose a Style</h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Change image
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {styles.map((style) => (
                    <motion.button
                      key={style.id}
                      onClick={() => handleStyleSelect(style.id)}
                      className={`relative aspect-square rounded-xl overflow-hidden group ${
                        selectedStyle === style.id
                          ? 'ring-2 ring-emerald-500'
                          : ''
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${style.color}`} />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{style.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Generate */}
            {currentStep === 3 && !showResult && (
              <motion.div
                key="generate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Ready to Generate</h3>
                    <p className="text-sm text-slate-400">
                      Style: <span className="text-emerald-400">{styles.find((s) => s.id === selectedStyle)?.name}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Change style
                  </button>
                </div>

                <div className="aspect-video rounded-xl bg-slate-900/50 flex items-center justify-center">
                  {isGenerating ? (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
                      <p className="text-white font-medium">Generating your design...</p>
                      <p className="text-sm text-slate-400">This usually takes 8-10 seconds</p>
                    </div>
                  ) : !canGenerate ? (
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                      <p className="text-white font-medium">Demo limit reached</p>
                      <p className="text-sm text-slate-400 mb-4">Sign up to get unlimited generations</p>
                      <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium">
                        Sign up free
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-6">Your room will be transformed into {styles.find((s) => s.id === selectedStyle)?.name} style</p>
                      <motion.button
                        onClick={handleGenerate}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-glow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Generate Design
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Result */}
            {showResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Your Redesigned Room</h3>
                    <p className="text-sm text-slate-400">
                      Style: <span className="text-emerald-400">{styles.find((s) => s.id === selectedStyle)?.name}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Start Over
                  </button>
                </div>

                <BeforeAfterSlider
                  beforeImage={uploadedImage || ''}
                  afterImage=""
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download HD Image
                  </motion.button>
                  <motion.button
                    className="btn-gradient-border px-6 py-3 rounded-xl text-white font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign up for more
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export default DemoSection;
