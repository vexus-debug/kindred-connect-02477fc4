import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Quote, Play } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import patientMale from "@/assets/patient-male.jpg";
import patientFemale from "@/assets/patient-female.jpg";
import heroSmile from "@/assets/hero-smile.jpg";

const testimonials = [
  {
    id: 1,
    name: "Amina O.",
    role: "Teeth Whitening",
    rating: 5,
    text: "Vista Dental Care transformed my smile! The team is incredibly professional and made me feel comfortable throughout my treatment. I couldn't be happier with the results.",
    image: patientFemale,
  },
  {
    id: 2,
    name: "Chukwudi E.",
    role: "Dental Implants",
    rating: 5,
    text: "Best dental experience I've ever had. The clinic is modern and clean, and the staff are so friendly. My dental implants look and feel completely natural. Highly recommend!",
    image: patientMale,
  },
  {
    id: 3,
    name: "Fatima M.",
    role: "Root Canal",
    rating: 5,
    text: "I was so nervous about my root canal, but Dr. Vista made it painless. The whole team went above and beyond to ensure I was comfortable. Thank you for your gentle care!",
    image: heroSmile,
  },
  {
    id: 4,
    name: "David A.",
    role: "Orthodontics",
    rating: 5,
    text: "The braces treatment exceeded my expectations. Regular check-ups were always on time, and the staff explained everything clearly. My smile transformation is amazing!",
    image: patientMale,
  },
  {
    id: 5,
    name: "Grace N.",
    role: "General Checkup",
    rating: 5,
    text: "Finally found a dental clinic where I feel truly cared for. The preventive care program has helped me maintain perfect oral health. Couldn't ask for better service!",
    image: patientFemale,
  },
];

export function TestimonialsSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section ref={ref} className="py-20 md:py-28 bg-card relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath fill='%23059669' d='M40 20c-5 0-9 3-10 8-1 5-2 10-2 15 0 4 2 8 4 12 2 4 4 6 8 6s6-2 8-6c2-4 4-8 4-12 0-5-1-10-2-15-1-5-5-8-10-8z'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            What Our <span className="text-secondary">Patients Say</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Don't just take our word for it. Here's what our patients have to say about their experience.
          </p>
        </motion.div>

        {/* Carousel */}
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main testimonial card */}
          <div className="relative overflow-hidden rounded-3xl bg-muted shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2"
              >
                {/* Image side */}
                <div className="relative h-64 md:h-auto">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-muted md:bg-gradient-to-t md:from-muted/50 md:to-transparent" />
                  
                  {/* Video play button placeholder */}
                  <motion.button
                    className="absolute bottom-4 left-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-6 h-6 text-secondary-foreground ml-1" />
                  </motion.button>
                </div>

                {/* Content side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  {/* Quote icon */}
                  <Quote className="w-12 h-12 text-secondary/20 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg text-foreground mb-6 leading-relaxed">
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary">
                      <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonials[currentIndex].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-secondary w-8' 
                    : 'bg-secondary/30 hover:bg-secondary/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Button asChild variant="outline" className="group">
            <Link to="/testimonials">
              Read More Reviews
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
