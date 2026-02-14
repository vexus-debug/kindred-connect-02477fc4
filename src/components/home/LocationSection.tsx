import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Mail, Instagram, ExternalLink, Navigation } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import clinicImage from "@/assets/clinic-interior.jpg";

const contactCards = [
  {
    icon: MapPin,
    title: "Address",
    content: "Shop 221, Axis Plaza, Plot 678, Rachel T. Owolabi Close, Gaduwa, Abuja.",
    action: "Get Directions",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "070 8878 8880\n090 7776 6681",
    action: "Call Now",
    href: "tel:+2347088788880",
    color: "from-secondary to-teal-600",
  },
  {
    icon: Clock,
    title: "Working Hours",
    content: "Mon - Sat: 9:00 AM - 6:00 PM\nSunday: Closed",
    badge: "Open Today",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@vistadentalcare.com",
    action: "Send Email",
    href: "mailto:info@vistadentalcare.com",
    color: "from-purple-500 to-purple-600",
  },
];

// Mock Instagram posts
const instagramPosts = [
  { id: 1, image: clinicImage },
  { id: 2, image: clinicImage },
  { id: 3, image: clinicImage },
  { id: 4, image: clinicImage },
];

export function LocationSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-dental-teal-pale/30 to-transparent rounded-full blur-3xl" />

      <div className="container relative">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Visit Our <span className="text-secondary">Clinic</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Conveniently located in Gaduwa, Abuja. Modern facilities, easy access, and a welcoming environment.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Map and Virtual Tour */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Map Placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-card h-[400px] group">
              {/* Map background with styling */}
              <div className="absolute inset-0 bg-gradient-to-br from-dental-teal-pale to-dental-mint">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%23059669' stroke-width='0.5' d='M0 50h100M50 0v100M0 25h100M0 75h100M25 0v100M75 0v100'/%3E%3C/svg%3E")`,
                  backgroundSize: '50px 50px',
                }} />
              </div>

              {/* Custom marker */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary rotate-45" />
                </div>
              </motion.div>

              {/* Overlay content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-foreground font-semibold mb-4">Vista Dental Care</p>
                  <Button className="bg-secondary hover:bg-secondary/90 group">
                    <Navigation className="mr-2 h-4 w-4" />
                    Open in Google Maps
                    <ExternalLink className="ml-2 h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Virtual Tour Teaser */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-lg bg-card p-6 group cursor-pointer card-hover"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={clinicImage} 
                    alt="Clinic interior"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Take a Virtual Tour</h4>
                  <p className="text-sm text-muted-foreground">Explore our modern facilities from the comfort of your home</p>
                </div>
                <ExternalLink className="w-5 h-5 text-secondary" />
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Contact Cards */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Contact cards grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  className="bg-card rounded-xl p-6 shadow-lg card-hover relative overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>

                  <h4 className="font-semibold text-foreground mb-2">{card.title}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line mb-3">
                    {card.content}
                  </p>

                  {card.badge && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {card.badge}
                    </span>
                  )}

                  {card.action && (
                    <a 
                      href={card.href || "#"}
                      className="text-secondary text-sm font-medium hover:underline inline-flex items-center gap-1"
                    >
                      {card.action}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Instagram Preview */}
            <motion.div
              className="bg-card rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Follow Us</h4>
                    <p className="text-xs text-muted-foreground">@vistadentalcare</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="group">
                  Follow
                  <ExternalLink className="ml-2 h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {instagramPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img 
                      src={post.image} 
                      alt={`Instagram post ${index + 1}`}
                      className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
