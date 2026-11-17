"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function WeddingInvitation() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wishes, setWishes] = useState<string[]>([
    "Wishing you both a lifetime of love and joy! ✨",
    "May Allah bless your sacred union with endless happiness.",
  ]);
  const [newWish, setNewWish] = useState("");
  const [nameInput, setNameInput] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const weddingDate = new Date("2026-08-18T20:30:00").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStartReveal = () => {
    setStep(2);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setTimeout(() => {
      setStep(3);
    }, 4500);
  };

  // Scratch Card Setup
  useEffect(() => {
    if (step !== 3) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#D4AF37");
    grad.addColorStop(0.5, "#FFF2B2");
    grad.addColorStop(1, "#AA7C11");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#1B3B2B";
    ctx.font = "bold 13px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ SCRATCH TO REVEAL DATE ✨", width / 2, height / 2 + 5);
  }, [step]);

  const scratch = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) clearPixels++;
    }

    if (clearPixels / (imageData.data.length / 4) > 0.4) {
      setIsScratched(true);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
    }
  };

  const galleryImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  ];

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.trim()) return;
    const author = nameInput.trim() ? nameInput : "Well Wisher";
    setWishes([`"${newWish}" — ${author}`, ...wishes]);
    setNewWish("");
    setNameInput("");
  };

  return (
    <div className="min-h-screen bg-[#0F2318] text-[#E8DFC5] font-serif relative overflow-x-hidden select-none">
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113549.mp3"
      />

      {/* Floating Audio Button */}
      {step === 3 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={toggleAudio}
          className="fixed top-5 right-5 z-40 bg-[#163023]/90 backdrop-blur-md text-[#D4AF37] p-3 rounded-full shadow-2xl border border-[#D4AF37]/50 hover:scale-110 active:scale-95 transition"
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </motion.button>
      )}

      {/* ---------------- STEP 1: ROYAL ENTRANCE GATES & BADGE ---------------- */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1810] overflow-hidden">
            {/* Left Gate */}
            <motion.div
              exit={{ x: "-100%" }}
              transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#0D1F15] via-[#142B1E] to-[#1C3B29] border-r-2 border-[#D4AF37]/60 shadow-2xl flex items-center justify-end"
            >
              <div className="w-px h-72 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent mr-4" />
            </motion.div>

            {/* Right Gate */}
            <motion.div
              exit={{ x: "100%" }}
              transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#0D1F15] via-[#142B1E] to-[#1C3B29] border-l-2 border-[#D4AF37]/60 shadow-2xl flex items-center justify-start"
            >
              <div className="w-px h-72 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent ml-4" />
            </motion.div>

            {/* Center Content & Premium Emerald Wax Seal Button */}
            <motion.div
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 text-center px-4"
            >
              <div className="text-[#D4AF37] text-2xl md:text-3xl font-serif mb-3 drop-shadow-md">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </div>
              <p className="text-[11px] text-[#C9B998] font-sans tracking-[0.25em] uppercase mb-10 max-w-xs mx-auto">
                In The Name Of Allah, The Most Gracious, The Most Merciful
              </p>

              {/* Upgraded Royal Emerald Wax Seal Badge */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleStartReveal}
                className="relative group cursor-pointer inline-block"
              >
                <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#0F2B1D] via-[#1A452F] to-[#255C3E] p-1.5 shadow-[0_0_50px_rgba(212,175,55,0.4)] border-2 border-[#D4AF37]">
                  <div className="w-full h-full rounded-full border border-[#D4AF37]/40 flex flex-col items-center justify-center p-3 bg-radial from-[#1A452F] to-[#0A1810]">
                    <Sparkles className="w-5 h-5 text-[#D4AF37] mb-1 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#F3E5AB] font-sans font-bold">
                      Open Invitation
                    </span>
                    <Heart className="w-4 h-4 text-[#D4AF37] mt-1.5 fill-current" />
                  </div>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- STEP 2: QUBOOL HAI ANIMATION ---------------- */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0F2318] text-[#E8DFC5] px-6 text-center"
          >
            <div className="absolute top-8 text-[#D4AF37] text-xs font-sans tracking-[0.3em] uppercase">
              The Sacred Union Of Nikkah
            </div>

            <div className="my-auto space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xs text-[#C9B998] uppercase tracking-[0.3em] font-sans"
              >
                With The Blessed Words
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 1.0 }}
                className="text-6xl md:text-7xl font-serif text-[#D4AF37] font-bold tracking-wider py-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                قبول ہے
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.2 }}
                className="text-sm text-[#E8DFC5] font-serif italic"
              >
                Chaudhary Sanan & Zainab Ghaffar
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- STEP 3: MAIN EMERALD & GOLD INVITATION CARD ---------------- */}
      {step === 3 && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-md mx-auto min-h-screen pb-20 px-6 relative border-x border-[#D4AF37]/30 shadow-2xl overflow-hidden bg-gradient-to-b from-[#0F2318] via-[#142D1F] to-[#0A1810]"
        >
          {/* Decorative Gold Inner Border */}
          <div className="absolute inset-0 border-[10px] border-[#D4AF37]/15 pointer-events-none rounded-3xl m-2" />

          {/* FIRST VIEW */}
          <section className="text-center pt-16 pb-10 relative z-10 min-h-[85vh] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[#D4AF37] text-2xl font-serif mb-2"
            >
              وَخَلَقْنَاكُمْ أَزْوَاجًا
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xs italic text-[#C9B998] font-serif mb-6"
            >
              "And We Created You In Pairs"
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-sans mb-8"
            >
              Request The Honour Of Your Presence At The
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-2xl font-serif text-[#F3E5AB] italic font-normal mb-6"
            >
              Nikkah Ceremony
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl font-serif text-[#FFFFFF] tracking-wide font-bold">
                Chaudhary Sanan
              </h1>
              <span className="text-2xl text-[#D4AF37] italic font-serif block">
                &
              </span>
              <h1 className="text-4xl font-serif text-[#FFFFFF] tracking-wide font-bold">
                Zainab Ghaffar
              </h1>
            </motion.div>

            {/* Timings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="mt-8 p-5 rounded-2xl bg-[#163023]/90 border border-[#D4AF37]/40 shadow-lg w-full max-w-xs text-xs space-y-1.5"
            >
              <p className="text-[#D4AF37] font-sans uppercase tracking-widest text-[10px]">
                Insha Allah
              </p>
              <p className="text-base font-serif font-bold text-[#FFFFFF]">
                Saturday, 18 August 2026
              </p>
              <div className="pt-2 text-[#E8DFC5] space-y-1 font-sans">
                <p>Gathering ..................... 8:30 PM</p>
                <p>Nikkah ........................... 9:00 PM</p>
                <p>Dinner .......................... 10:00 PM</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{
                opacity: { delay: 2 },
                y: { repeat: Infinity, duration: 1.8 },
              }}
              className="mt-10 text-[10px] uppercase tracking-widest text-[#D4AF37] font-sans font-semibold"
            >
              ↓ Scroll Down For Details
            </motion.div>
          </section>

          {/* Date Scratch Card */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="my-12 text-center relative z-10"
          >
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-sans mb-4">
              Scratch Card Reveal
            </h3>
            <div className="relative w-64 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl bg-[#163023]">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1A382A] to-[#0D1F15] p-4 text-[#FFFFFF]">
                <Calendar className="w-6 h-6 text-[#D4AF37] mb-1" />
                <p className="font-bold text-xl font-serif">August 18, 2026</p>
                <p className="text-xs text-[#C9B998] font-sans">
                  Saturday • 8:30 PM ONWARDS
                </p>
              </div>

              {!isScratched && (
                <canvas
                  ref={canvasRef}
                  width={256}
                  height={144}
                  onMouseDown={() => (isDrawing.current = true)}
                  onMouseUp={() => (isDrawing.current = false)}
                  onMouseMove={(e) => isDrawing.current && scratch(e)}
                  onTouchStart={() => (isDrawing.current = true)}
                  onTouchEnd={() => (isDrawing.current = false)}
                  onTouchMove={(e) => scratch(e)}
                  className="absolute inset-0 cursor-pointer touch-none z-10"
                />
              )}
            </div>
          </motion.section>

          {/* Countdown Timer */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="my-12 text-center relative z-10"
          >
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-sans mb-4">
              Countdown to Nikkah
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Mins", val: timeLeft.minutes },
                { label: "Secs", val: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#163023] text-[#F3E5AB] p-3 rounded-xl border border-[#D4AF37]/40 shadow-lg"
                >
                  <span className="text-xl font-bold font-mono block">
                    {String(item.val).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-sans block mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Gallery Carousel */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="my-12 text-center relative z-10"
          >
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-sans mb-4">
              Our Moments
            </h3>
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/40">
              <img
                src={galleryImages[currentSlide]}
                alt="Couple"
                className="w-full h-64 object-cover transition duration-500"
              />
              <button
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? galleryImages.length - 1 : prev - 1,
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === galleryImages.length - 1 ? 0 : prev + 1,
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.section>

          {/* Venue Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="my-12 text-center relative z-10"
          >
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-sans mb-4">
              Venue Location
            </h3>
            <div className="p-6 bg-[#163023]/90 rounded-2xl border border-[#D4AF37]/30 shadow-md">
              <MapPin className="w-8 h-8 mx-auto text-[#D4AF37] mb-2" />
              <h4 className="font-bold text-base text-[#FFFFFF]">
                Grand Palace Marquee
              </h4>
              <p className="text-xs text-[#C9B998] mb-4">
                Main Boulevard, City Center
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0A1810] px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#F3E5AB] transition shadow"
              >
                Get Directions
              </a>
            </div>
          </motion.section>

          {/* RSVP & Guest Wishes */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="my-12 relative z-10"
          >
            <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] font-sans text-center mb-4">
              Blessings & RSVP
            </h3>
            <form onSubmit={handleAddWish} className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Your Name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-[#D4AF37]/30 bg-[#163023] text-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
              <textarea
                placeholder="Write your prayers for the couple..."
                rows={3}
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-[#D4AF37]/30 bg-[#163023] text-[#FFFFFF] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-[#0A1810] py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow hover:bg-[#F3E5AB] transition"
              >
                <Send className="w-3.5 h-3.5" /> Send Prayers
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {wishes.map((w, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#163023]/90 rounded-xl border border-[#D4AF37]/30 text-xs text-[#E8DFC5]"
                >
                  {w}
                </div>
              ))}
            </div>
          </motion.section>

          {/* Ending Blessing */}
          <footer className="text-center pt-8 border-t border-[#D4AF37]/30 relative z-10 space-y-3">
            <div className="text-[#D4AF37] text-xl font-serif">
              جَزَاكُمُ اللَّهُ خَيْرًا
            </div>
            <p className="text-xs font-serif italic text-[#E8DFC5]">
              "May their Nikkah be the beginning of a beautiful forever, written
              with love and blessed by Allah."
            </p>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-sans">
              Chaudhary Sanan & Zainab Ghaffar
            </p>
          </footer>
        </motion.main>
      )}
    </div>
  );
}
