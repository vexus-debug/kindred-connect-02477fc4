import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Vista Dental Care" className="h-12 w-12 rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="text-lg font-bold">Vista Dental</span>
                <span className="text-xs text-primary-foreground/70">Care</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Your trusted partner for comprehensive dental care in Abuja. We're committed to giving you a healthy, beautiful smile.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/vista.dcs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services/general-preventive" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  General & Preventive
                </Link>
              </li>
              <li>
                <Link to="/services/cosmetic" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Cosmetic Dentistry
                </Link>
              </li>
              <li>
                <Link to="/services/orthodontics" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Orthodontics
                </Link>
              </li>
              <li>
                <Link to="/services/implants" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Dental Implants
                </Link>
              </li>
              <li>
                <Link to="/services/oral-surgery" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Oral Surgery
                </Link>
              </li>
              <li>
                <Link to="/services/periodontics" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Gum Treatment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">
                  Shop 221, Axis Plaza, Plot 678, Rachel T. Owolabi Close, Gaduwa, Abuja.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <div className="text-primary-foreground/80">
                  <a href="tel:07088788880" className="hover:text-secondary transition-colors block">
                    070 8878 8880
                  </a>
                  <a href="tel:09077766681" className="hover:text-secondary transition-colors block">
                    090 7776 6681
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a
                  href="mailto:Vista.dcs@gmail.com"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  Vista.dcs@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-primary-foreground/80">
                  Mon - Sat: 9:00 AM - 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>© 2026 Vista Dental Care. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-secondary transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
