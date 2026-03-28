import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [phase, setPhase] = useState<'typing' | 'zoom' | 'done'>('typing');
  const navigate = useNavigate();
  const text = "Smart Business Hub";
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('zoom'), 800);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'zoom') {
      setTimeout(() => navigate('/app'), 1000);
    }
  }, [phase, navigate]);

  return (
    <div className="relative h-screen overflow-hidden bg-black text-white">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(0,150,255,0.2), black)',
            filter: 'blur(50px)',
          }}
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-screen flex flex-col items-center justify-center text-center"
        animate={phase === 'zoom' ? { scale: 5, opacity: 0 } : {}}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <motion.h1
          className="text-5xl sm:text-7xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Schrödinger
        </motion.h1>

        <div className="mt-5 text-xl sm:text-2xl h-8 font-light">
          <span>{displayedText}</span>
          <motion.span
            className="inline-block w-0.5 h-6 bg-white ml-1 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
