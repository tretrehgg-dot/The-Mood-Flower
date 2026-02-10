
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { flowers, categories } from './data/flowers';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parallax for background
  const springConfig = { damping: 50, stiffness: 400 };
  const bgX = useSpring(mouseX, springConfig);
  const bgY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * -0.02);
      mouseY.set((e.clientY - window.innerHeight / 2) * -0.02);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFlowerClick = (flower) => {
    setSelectedFlower(flower);
    setIsModalOpen(true);
  };

  const filteredFlowers = selectedCategory === 'all'
    ? flowers
    : flowers.filter(f => f.category === selectedCategory);

  return (
    <div className="relative min-h-screen text-[#590d22] overflow-x-hidden selection:bg-[#fb6f92] selection:text-white bg-[#fff0f3]">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <BloomingIntro key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
             {/* Dynamic Background */}
            <motion.div 
                className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-[#fff0f3] via-white to-[#ffe5ec]"
                style={{ x: bgX, y: bgY, scale: 1.1 }}
            ></motion.div>
            <div className="fixed inset-0 pointer-events-none z-0 opacity-30 mix-blend-soft-light bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* Floating Petals (Particles) */}
            <FloatingPetals />

            {/* Navigation */}
            <Navbar />

            {/* Hero Content */}
            <HeroSection mouseX={mouseX} mouseY={mouseY} />

            {/* Featured Section */}
            <FeaturedSection flowers={flowers.slice(0, 3)} onFlowerClick={handleFlowerClick} />

            {/* Collection Grid */}
            <AnimatedGridCollection 
                flowers={filteredFlowers}
                onFlowerClick={handleFlowerClick}
            />

            {/* Contact Section */}
            <ContactSection />

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && selectedFlower && (
                <FlowerModal flower={selectedFlower} onClose={() => setIsModalOpen(false)} />
                )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========== SECTIONS ==========

function BloomingIntro({ onComplete }) {
    return (
        <motion.div 
            className="fixed inset-0 z-[999] bg-[#fff0f3] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 1 } }}
        >
            {/* Bottom-Left Bouquet Entry */}
            <motion.div
                className="absolute left-[-10%] bottom-[-10%] w-[70vw] md:w-[40vw] z-10 origin-bottom-left"
                initial={{ x: "-100%", y: "50%", rotate: -45, opacity: 0 }}
                animate={{ 
                    x: ["-50%", "0%", "0%"], 
                    y: ["50%", "0%", "0%"],
                    rotate: [-45, -10, 0],
                    opacity: [0, 1, 1],
                    scale: [0.8, 1, 4], // Bloom Huge
                    filter: ["blur(0px)", "blur(0px)", "blur(20px)"]
                }}
                transition={{ 
                    duration: 4, 
                    times: [0, 0.5, 1],
                    ease: "easeInOut"
                }}
            >
                 {/* Premium Rose Bouquet */}
                 <img src={flowers[2].image} alt="Bouquet Left" className="w-full h-full object-contain drop-shadow-2xl" />
            </motion.div>

            {/* Bottom-Right Bouquet Entry */}
            <motion.div
                className="absolute right-[-10%] bottom-[-10%] w-[70vw] md:w-[40vw] z-10 origin-bottom-right"
                initial={{ x: "100%", y: "50%", rotate: 45, opacity: 0 }}
                animate={{ 
                    x: ["50%", "0%", "0%"], 
                    y: ["50%", "0%", "0%"],
                    rotate: [45, 10, 0],
                    opacity: [0, 1, 1],
                    scale: [0.8, 1, 4], // Bloom Huge
                    filter: ["blur(0px)", "blur(0px)", "blur(20px)"]
                }}
                transition={{ 
                    duration: 4, 
                    times: [0, 0.5, 1],
                    ease: "easeInOut",
                    delay: 0.1
                }}
            >
                 {/* Mirror image for symmetry */}
                 <img src={flowers[2].image} alt="Bouquet Right" className="w-full h-full object-contain scale-x-[-1] drop-shadow-2xl" />
            </motion.div>

             {/* Branding Text Reveal */}
            <motion.div 
                className="z-20 text-center relative"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                    opacity: [0, 1, 1, 0], 
                    scale: [0.8, 1, 1, 1.2],
                    y: [20, 0, 0, -50]
                }}
                transition={{ duration: 3.2, times: [0, 0.3, 0.8, 1], delay: 0.5 }}
                onAnimationComplete={onComplete}
            >
                 <h1 className="font-display text-5xl md:text-8xl text-[#590d22] drop-shadow-lg">THE MOOD</h1>
                 <div className="w-24 h-1 bg-[#fb6f92] mx-auto my-4 rounded-full"></div>
                 <p className="text-[#590d22] tracking-[0.5em] text-sm md:text-xl uppercase font-bold">Welcome</p>
            </motion.div>
        </motion.div>
    );
}

function HeroSection({ mouseX, mouseY }) {
    const titleX = useTransform(mouseX, [ -100, 100], [ -20, 20]);
    const titleY = useTransform(mouseY, [ -100, 100], [ -20, 20]);
    const flowerX = useTransform(mouseX, [ -100, 100], [ 10, -10]);
    const flowerY = useTransform(mouseY, [ -100, 100], [ 10, -10]);

    return (
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full overflow-hidden">
        
        {/* Cinematic Title (Background Layer) */}
        <motion.div 
            style={{ x: titleX, y: titleY }}
            className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        >
            <h1 className="font-display text-[15vw] md:text-[18vw] leading-none text-[#590d22]/5 tracking-tighter select-none whitespace-nowrap">
                THE MOOD
            </h1>
        </motion.div>

        {/* Main Subject (Middle Layer) */}
        <div className="relative z-10 flex flex-col items-center">
            <motion.div
                style={{ x: flowerX, y: flowerY }}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative w-64 md:w-[500px] aspect-square rounded-full overflow-hidden"
            >
                {/* Glow Behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#fb6f92]/20 blur-[100px] rounded-full animate-pulse"></div>
                
                <img 
                    src="/img/logo.jpg" 
                    alt="Hero Flower" 
                    className="w-full h-full object-cover drop-shadow-2xl animate-sway-slow rounded-full"
                />
            </motion.div>

            {/* Foreground Text (Front Layer) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-center mt-8 z-20"
            >
                <p className="text-[#fb6f92] uppercase tracking-[0.3em] text-sm md:text-base font-bold mb-4">Premium Florist</p>
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl md:text-5xl font-display text-[#590d22]">Where Emotions</h2>
                    <h2 className="text-3xl md:text-5xl font-display text-[#590d22] italic">Take Shape</h2>
                </div>
                
                <div className="mt-12 flex justify-center gap-6">
                    <button onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })} className="glass-button px-8 py-3 rounded-full text-[#590d22] font-bold uppercase text-xs tracking-widest hover:bg-[#fb6f92] hover:text-white transition-all shadow-lg">
                        Explore Collection
                    </button>
                </div>
            </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#590d22]/40 text-sm animate-bounce cursor-pointer z-20"
            onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
        >
            Scroll to Bloom ↓
        </motion.div>
      </section>
    );
}

function FeaturedSection({ flowers, onFlowerClick }) {
    return (
        <section className="relative z-10 py-32 px-4 md:px-16">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="text-[#fb6f92] uppercase tracking-[0.3em] text-sm">Our Favorites</span>
                    <h2 className="text-4xl md:text-5xl font-display mt-4 text-[#590d22]">Soft & Gentle</h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {flowers.map((flower, i) => (
                        <motion.div
                            key={flower.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => onFlowerClick(flower)}
                            className="glass-card group cursor-pointer relative overflow-hidden p-4"
                        >
                            <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4 relative">
                                <img 
                                    src={flower.image} 
                                    alt={flower.nameThai}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" 
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                            <h3 className="font-display text-2xl text-[#590d22]">{flower.nameThai}</h3>
                            <p className="text-[#590d22]/60 text-sm mt-1 mb-3">{flower.name}</p>
                            <div className="flex justify-between items-center border-t border-[#590d22]/10 pt-3">
                                <span className="text-[#fb6f92] font-semibold">฿{flower.price}</span>
                                <span className="text-[#590d22]/50 text-sm uppercase tracking-wider group-hover:text-[#fb6f92] transition-colors">View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AnimatedGridCollection({ flowers, onFlowerClick }) {
    return (
        <section id="collection" className="relative z-10 py-20 px-4 md:px-16 bg-[#fff0f3]">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-[#fb6f92] uppercase tracking-[0.3em] text-sm font-bold">The Collection</span>
                    <h2 className="text-4xl md:text-6xl font-display mt-4 text-[#590d22]">In Full Bloom</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 cursor-pointer">
                    {flowers.map((flower, index) => (
                        <motion.div
                            key={flower.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onClick={() => onFlowerClick(flower)}
                            className="group relative bg-white/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Image Area */}
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img 
                                    src={flower.image} 
                                    alt={flower.nameThai}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#590d22]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Quick Actions */}
                                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                    <button className="w-10 h-10 rounded-full bg-white/90 text-[#fb6f92] flex items-center justify-center hover:bg-[#fb6f92] hover:text-white transition-colors shadow-lg">
                                        ❤️
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                     <span className="text-[#fb6f92] text-xs font-bold uppercase tracking-wider">{flower.category}</span>
                                     <span className="text-[#590d22]/40 text-xs">More Info ↗</span>
                                </div>
                                <h3 className="text-2xl font-display text-[#590d22] mb-1">{flower.nameThai}</h3>
                                <p className="text-[#590d22]/60 text-sm font-serif italic mb-4">{flower.name}</p>
                                
                                <div className="flex items-center justify-between border-t border-[#590d22]/10 pt-4 mt-4">
                                    <div>
                                        <p className="text-[10px] text-[#590d22]/40 uppercase tracking-widest">Starting at</p>
                                        <p className="text-xl font-bold text-[#fb6f92]">฿{flower.price.replace('เริ่ม ', '')}</p>
                                    </div>
                                    <button className="px-5 py-2 rounded-full bg-[#590d22] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#fb6f92] transition-colors">
                                        View
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ActionIcon({ icon, label, activeColor }) {
    return (
        <button className="flex flex-col items-center gap-1 group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg backdrop-blur-md bg-white/80 transition-all hover:scale-110 hover:bg-white ${activeColor || 'text-[#590d22]'}`}>
                {icon}
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#590d22]/70 bg-white/50 px-1 rounded-sm backdrop-blur-sm">{label}</span>
        </button>
    );
}

function ContactSection() {
    return (
        <section className="relative z-10 py-40 px-4 text-center">
             <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
             >
                 <img src="/img/logo.jpg" alt="Logo" className="w-24 h-24 object-contain mx-auto mb-8 opacity-80 rounded-full shadow-xl" />
                 <h2 className="text-5xl md:text-7xl font-display mb-8 text-[#590d22]">Let Love Bloom</h2>
                 <p className="text-[#590d22]/60 max-w-xl mx-auto mb-12 text-lg">
                    Crafting gentle moments for you and your loved ones.
                 </p>
                 <a 
                    href="https://line.me/ti/p/@yourlineid" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block border-2 border-[#fb6f92] text-[#fb6f92] px-10 py-4 rounded-full uppercase tracking-[0.2em] hover:bg-[#fb6f92] hover:text-white transition-all font-bold"
                 >
                    Contact via Line
                 </a>
             </motion.div>
        </section>
    );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center text-sm md:text-base bg-gradient-to-b from-[#fff0f3]/90 to-transparent backdrop-blur-sm">
      <div className="font-display text-xl md:text-2xl font-bold tracking-widest text-[#590d22]">
        THE MOOD
      </div>
      <div className="hidden md:flex items-center gap-12">
        <button onClick={() => window.scrollTo({top:0, behavior:'smooth'})} className="nav-link">Home</button>
        <button onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })} className="nav-link">Collection</button>
      </div>
      <a href="https://line.me/ti/p/@yourlineid" target="_blank" rel="noopener noreferrer" className="btn-primary shadow-md">
        Shop Now <span>↗</span>
      </a>
    </nav>
  );
}

function FlowerModal({ flower, onClose }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#590d22]/40 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-modal rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
            >
                <div className="md:w-1/2 relative min-h-[300px] overflow-hidden">
                    <img src={flower.image} alt={flower.nameThai} className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-1000" />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                    <span className="text-[#fb6f92] uppercase tracking-widest text-xs font-bold">{flower.category}</span>
                    <h2 className="text-4xl font-display mt-2 mb-1 text-[#590d22]">{flower.nameThai}</h2>
                    <p className="text-[#590d22]/50 mb-6 font-display italic">{flower.name}</p>
                    
                    <p className="text-[#590d22]/80 leading-relaxed mb-8 border-l-2 border-[#fb6f92] pl-4 italic">
                        "{flower.content.emotional_story}"
                    </p>

                    {/* Pricing Tiers */}
                    {flower.pricing_tiers && (
                        <div className="mb-8">
                            <h4 className="text-xs uppercase tracking-widest text-[#590d22]/40 mb-3">Pricing Options</h4>
                            <div className="grid gap-3">
                                {flower.pricing_tiers.map((tier, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[#fb6f92]/20 hover:bg-[#ffe5ec] transition-colors cursor-pointer group">
                                        <span className="text-sm font-display text-[#590d22]">{tier.name}</span>
                                        <span className="font-bold text-[#fb6f92] group-hover:scale-110 transition-transform">฿{tier.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-8">
                        <h4 className="text-xs uppercase tracking-widest text-[#590d22]/40 mb-2">Details</h4>
                        <div className="flex flex-wrap gap-2">
                             {flower.mainFlowers.map(f => (
                                 <span key={f} className="text-xs border border-[#590d22]/10 rounded-full px-3 py-1 text-[#590d22]/70 bg-white">{f}</span>
                             ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#590d22]/10">
                        <div>
                            <span className="text-xs text-[#590d22]/50 block">Starting at</span>
                            <span className="text-3xl font-display text-[#fb6f92]">฿{flower.price.replace('เริ่ม ', '')}</span>
                        </div>
                        <a href="https://line.me/ti/p/@yourlineid" target="_blank" rel="noopener noreferrer" className="bg-[#590d22] text-white px-8 py-3 rounded-full uppercase text-xs tracking-widest font-bold hover:bg-[#fb6f92] transition-colors shadow-lg">
                            Order Now
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function FloatingPetals() {
  const petals = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 10,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute w-3 h-3 md:w-4 md:h-4 bg-[#ffc2d1] rounded-full opacity-60 blur-[1px]"
          style={{ 
            left: petal.left, 
            top: petal.top,
          }}
          animate={{
            y: [0, 150, 0],
            x: [0, 50, -50, 0],
            rotate: [0, 180, 360],
            opacity: [0.6, 0.2, 0.6]
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export default App;
