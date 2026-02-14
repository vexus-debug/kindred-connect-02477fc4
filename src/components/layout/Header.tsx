import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Phone, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.jpg";

const services = [
  { title: "General & Preventive Dentistry", href: "/services/general-preventive", description: "Check-ups, scaling, fluoride treatments" },
  { title: "Cosmetic Dentistry", href: "/services/cosmetic", description: "Teeth whitening, veneers, fashion braces" },
  { title: "Orthodontics", href: "/services/orthodontics", description: "Braces, retainers, alignment correction" },
  { title: "Restorative & Prosthodontics", href: "/services/restorative", description: "Crowns, bridges, dentures" },
  { title: "Dental Implants", href: "/services/implants", description: "Natural-looking tooth replacements" },
  { title: "Oral Surgery", href: "/services/oral-surgery", description: "Extractions and surgical procedures" },
  { title: "Gum Treatment & Root Canal", href: "/services/periodontics", description: "Gum disease treatment, endodontics" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-10 items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:07088788880" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="h-3 w-3" />
              <span>070 8878 8880</span>
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="tel:09077766681" className="hidden sm:flex items-center gap-1 hover:text-secondary transition-colors">
              <span>090 7776 6681</span>
            </a>
          </div>
          <a href="mailto:Vista.dcs@gmail.com" className="hover:text-secondary transition-colors">
            Vista.dcs@gmail.com
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Vista Dental Care" className="h-12 w-12 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">Vista Dental</span>
            <span className="text-xs text-muted-foreground">Care</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent text-accent-foreground"
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent text-accent-foreground"
          >
            About Us
          </NavLink>

          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center">
              <NavLink
                to="/services"
                className="inline-flex h-10 items-center justify-center rounded-l-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-accent text-accent-foreground"
              >
                Services
              </NavLink>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="inline-flex h-10 items-center justify-center rounded-r-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground border-l border-border"
                aria-expanded={servicesOpen}
                aria-label="Toggle services menu"
              >
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown Menu */}
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-card rounded-lg shadow-xl border z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="p-2">
                  <Link
                    to="/services"
                    onClick={() => setServicesOpen(false)}
                    className="block p-3 rounded-md bg-gradient-to-r from-secondary/20 to-secondary/10 hover:from-secondary/30 hover:to-secondary/20 transition-colors mb-2"
                  >
                    <span className="font-semibold text-secondary">All Services</span>
                    <p className="text-xs text-muted-foreground mt-1">View our complete range of dental services</p>
                  </Link>
                  
                  <div className="space-y-1">
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        to={service.href}
                        onClick={() => setServicesOpen(false)}
                        className="block p-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium">{service.title}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/testimonials"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent text-accent-foreground"
          >
            Testimonials
          </NavLink>

          <NavLink
            to="/gallery"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent text-accent-foreground"
          >
            Gallery
          </NavLink>

          <NavLink
            to="/contact"
            className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent text-accent-foreground"
          >
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:inline-flex bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Appointment</Link>
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
                
                {/* Mobile Services with Collapsible */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/services"
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium hover:text-secondary transition-colors"
                    >
                      Services
                    </Link>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="p-2 hover:bg-accent rounded-md transition-colors"
                      aria-expanded={mobileServicesOpen}
                      aria-label="Toggle services submenu"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {mobileServicesOpen && (
                    <div className="pl-4 space-y-2 border-l-2 border-secondary/30 ml-2 animate-in slide-in-from-top-2 duration-200">
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          to={service.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-muted-foreground hover:text-secondary transition-colors py-1"
                        >
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/testimonials"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  to="/gallery"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  Gallery
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  Contact
                </Link>
                <Button asChild className="mt-4 bg-secondary hover:bg-secondary/90">
                  <Link to="/book-appointment" onClick={() => setIsOpen(false)}>
                    Book Appointment
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Valentine Promo Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2">
        <div className="container text-center text-sm font-medium">
          💝 Valentine Promo: 25% OFF all services! Feb 1 - 21, 2026{" "}
          <Link to="/promotions" className="underline hover:no-underline ml-2">
            Learn More →
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
