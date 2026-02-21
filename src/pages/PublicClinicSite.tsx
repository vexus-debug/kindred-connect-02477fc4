import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  MapPin, Phone, Mail, Clock, CheckCircle, Calendar, Star,
  Shield, ChevronDown, MessageCircle, Instagram, Facebook, ExternalLink,
  Loader2, Stethoscope, Users, Award, ShoppingBag,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

interface GalleryItem {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
}

interface SiteSettings {
  welcome_text?: string;
  primary_color?: string;
  accent_color?: string;
  short_description?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  whatsapp_number?: string;
  operating_hours?: { day: string; open: string; close: string; closed?: boolean }[];
  instagram_url?: string;
  facebook_url?: string;
  google_review_url?: string;
  certifications?: { title: string; description?: string }[];
  booking_confirmation_message?: string;
  gallery_items?: GalleryItem[];
}

interface ClinicInfo {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  settings: SiteSettings | null;
}

interface Treatment {
  id: string;
  name: string;
  price: number;
  category: string | null;
  description: string | null;
  duration: number | null;
}

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
  specialty: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  patients?: { first_name: string; last_name: string } | null;
}

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function PublicClinicSite() {
  const { slug } = useParams<{ slug: string }>();
  const [clinic, setClinic] = useState<ClinicInfo | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);

  // Booking form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const bookingRef = useRef<HTMLDivElement>(null);

  const s = clinic?.settings || {};
  const primaryColor = s.primary_color || "#2563eb";
  const accentColor = s.accent_color || "#1d4ed8";

  const dynamicStyles = useMemo(() => ({
    "--site-primary": primaryColor,
    "--site-accent": accentColor,
  } as React.CSSProperties), [primaryColor, accentColor]);

  useEffect(() => {
    const handleScroll = () => setHeaderSolid(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!slug) return;
    const fetchClinic = async () => {
      const { data: org, error } = await supabase
        .from("organizations")
        .select("id, name, address, phone, email, logo_url, settings")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !org) { setNotFound(true); setLoading(false); return; }
      setClinic(org as ClinicInfo);

      const [treatmentsRes, staffRes, reviewsRes] = await Promise.all([
        supabase.from("treatments").select("id, name, price, category, description, duration").eq("org_id", org.id).eq("status", "active").order("category"),
        supabase.from("staff").select("id, full_name, role, specialty").eq("org_id", org.id).eq("status", "active").in("role", ["dentist", "doctor", "hygienist", "owner"]),
        supabase.from("patient_reviews").select("id, rating, comment, created_at, patients(first_name, last_name)").eq("org_id", org.id).order("created_at", { ascending: false }).limit(6),
      ]);

      setTreatments(treatmentsRes.data || []);
      setStaff(staffRes.data || []);
      setReviews((reviewsRes.data as any) || []);
      setLoading(false);
    };
    fetchClinic();
  }, [slug]);

  const handleBook = async () => {
    if (!name || !phone || !selectedStaff || !date || !time) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setBooking(true);
    try {
      const res = await supabase.functions.invoke("public-booking", {
        body: { org_slug: slug, patient_name: name, patient_phone: phone, staff_id: selectedStaff, treatment_id: selectedTreatment || null, appointment_date: date, appointment_time: time },
      });
      if (res.error || res.data?.error) throw new Error(res.data?.error || res.error?.message || "Booking failed");
      setBooked(true);
      toast({ title: "Appointment booked successfully!" });
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setBooking(false);
    }
  };

  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth" });

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-5xl mx-auto space-y-8 pt-20">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinic Not Found</h1>
          <p className="text-gray-500">This clinic page doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const hours = s.operating_hours || [];
  const certs = s.certifications || [];
  const gallery = s.gallery_items || [];
  const confirmMsg = s.booking_confirmation_message || "We'll be in touch to confirm your appointment.";

  return (
    <div className="min-h-screen bg-white" style={dynamicStyles}>
      {/* ── Sticky Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: headerSolid ? primaryColor : "transparent",
          boxShadow: headerSolid ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {clinic?.logo_url && (
              <img src={clinic.logo_url} alt={clinic?.name} className="h-10 w-10 rounded-full object-cover border-2 border-white/30 shadow-sm" />
            )}
            <span className={`text-lg font-bold drop-shadow-sm ${headerSolid ? "text-white" : "text-gray-900"}`}>{clinic?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/site/${slug}/shop`}>
              <Button size="sm" variant="ghost" className={headerSolid ? "text-white/90 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}>
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Shop
              </Button>
            </Link>
            {clinic?.phone && (
              <Button size="sm" variant="ghost" className={`hidden sm:flex ${headerSolid ? "text-white/90 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`} asChild>
                <a href={`tel:${clinic.phone}`}><Phone className="mr-1.5 h-3.5 w-3.5" /> Call</a>
              </Button>
            )}
            {s.whatsapp_number && (
              <Button size="sm" variant="ghost" className={headerSolid ? "text-white/90 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} asChild>
                <a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> WhatsApp
                </a>
              </Button>
            )}
            <Button
              size="sm"
              className="font-semibold shadow-md text-white"
              style={{ backgroundColor: primaryColor }}
              onClick={scrollToBooking}
            >
              Book Now
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-48 w-[600px] h-[600px] rounded-full blur-3xl" style={{ backgroundColor: hexToRgba(primaryColor, 0.07) }} />
          <div className="absolute -bottom-32 -left-48 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: hexToRgba(accentColor, 0.06) }} />
        </div>
        {s.hero_image_url && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.hero_image_url})`, opacity: 0.08 }} />
        )}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              {s.hero_title || s.welcome_text || `Welcome to ${clinic?.name}`}
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-xl mx-auto">
              {s.hero_subtitle || s.short_description || "Professional healthcare for you and your family"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="font-semibold px-8 shadow-lg text-base text-white" style={{ backgroundColor: primaryColor }} onClick={scrollToBooking}>
                <Calendar className="mr-2 h-5 w-5" /> Book Appointment
              </Button>
              {clinic?.phone && (
                <Button size="lg" variant="outline" className="px-8 text-base border-gray-200 text-gray-700 hover:bg-gray-50" asChild>
                  <a href={`tel:${clinic.phone}`}><Phone className="mr-2 h-5 w-5" /> Call Us</a>
                </Button>
              )}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-gray-400">
            {staff.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" style={{ color: primaryColor }} />
                <span className="text-sm font-medium text-gray-600">{staff.length} Doctor{staff.length > 1 ? "s" : ""}</span>
              </div>
            )}
            {avgRating && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-600">{avgRating} Rating</span>
              </div>
            )}
          </motion.div>
        </div>
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="h-6 w-6 text-gray-300" />
        </motion.div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── 1. Booking Section (First) ── */}
        <FadeInSection className="mt-12 mb-16">
          <div ref={bookingRef} className="scroll-mt-24">
            <Card className="shadow-md border border-gray-100 overflow-hidden bg-white">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-6 w-6" style={{ color: primaryColor }} /> Book an Appointment
                </h2>
                <p className="text-gray-500 mt-1 text-sm">Select your preferred service, doctor, date and time</p>
              </div>
              <CardContent className="p-6">
                {booked ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-4">
                    <div className="h-16 w-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: hexToRgba(primaryColor, 0.1) }}>
                      <CheckCircle className="h-8 w-8" style={{ color: primaryColor }} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Appointment Booked!</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">{confirmMsg}</p>
                    <Button variant="outline" className="border-gray-200" onClick={() => { setBooked(false); setName(""); setPhone(""); setSelectedStaff(""); setSelectedTreatment(""); setDate(""); setTime(""); }}>
                      Book Another
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name *</label>
                      <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="h-11 border-gray-200" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone *</label>
                      <Input placeholder="080xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 border-gray-200" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</label>
                      <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                        <SelectTrigger className="h-11 border-gray-200"><SelectValue placeholder="Select service (optional)" /></SelectTrigger>
                        <SelectContent>
                          {treatments.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.name} — ₦{t.price.toLocaleString()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Doctor *</label>
                      <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                        <SelectTrigger className="h-11 border-gray-200"><SelectValue placeholder="Select doctor" /></SelectTrigger>
                        <SelectContent>
                          {staff.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.full_name}{s.specialty ? ` — ${s.specialty}` : ""}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferred Date *</label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="h-11 border-gray-200" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferred Time *</label>
                      <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-11 border-gray-200" />
                    </div>
                    <div className="sm:col-span-2">
                      <Button className="w-full h-12 text-white text-base font-semibold shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: primaryColor }} onClick={handleBook} disabled={booking}>
                        {booking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</> : "Book Appointment"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </FadeInSection>

        {/* ── 2. Gallery (Masonry Grid) ── */}
        {gallery.length > 0 && (
          <FadeInSection className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Our Gallery</h2>
              <p className="text-gray-500 mt-2">See our procedures and facilities</p>
            </div>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {gallery.map((item, i) => (
                <FadeInSection key={item.id} delay={i * 0.05}>
                  <div className="break-inside-avoid group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src={item.image_url}
                      alt={item.title || "Gallery image"}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    {(item.title || item.description) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div>
                          {item.title && <p className="text-white font-semibold text-sm">{item.title}</p>}
                          {item.description && <p className="text-white/80 text-xs mt-0.5">{item.description}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </FadeInSection>
              ))}
            </div>
          </FadeInSection>
        )}

        {/* ── 3. Our Doctors ── */}
        {staff.length > 0 && (
          <FadeInSection className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Our Doctors</h2>
              <p className="text-gray-500 mt-2">Experienced professionals dedicated to your care</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((doc, i) => (
                <FadeInSection key={doc.id} delay={i * 0.08}>
                  <Card className="text-center p-6 hover:shadow-md transition-all duration-300 border border-gray-100 bg-white">
                    <div className="h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }}>
                      {doc.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{doc.full_name}</h3>
                    {doc.specialty && <p className="text-sm mt-1" style={{ color: primaryColor }}>{doc.specialty}</p>}
                    <Badge variant="secondary" className="mt-3 text-xs capitalize bg-gray-100 text-gray-600">{doc.role}</Badge>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </FadeInSection>
        )}

        {/* ── 4. Operating Hours ── */}
        {hours.length > 0 && (
          <FadeInSection className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Operating Hours</h2>
            </div>
            <Card className="max-w-md mx-auto shadow-sm border border-gray-100 bg-white">
              <CardContent className="p-0">
                {hours.map((h, i) => {
                  const isToday = new Date().toLocaleDateString("en-US", { weekday: "long" }) === h.day;
                  return (
                    <div key={h.day} className={`flex items-center justify-between px-6 py-3.5 ${i < hours.length - 1 ? "border-b border-gray-50" : ""} ${isToday ? "bg-gray-50/50" : ""}`}>
                      <span className={`text-sm ${isToday ? "font-bold text-gray-900" : "text-gray-600"}`}>
                        {h.day} {isToday && <span className="text-xs ml-1" style={{ color: primaryColor }}>(Today)</span>}
                      </span>
                      <span className={`text-sm ${h.closed ? "text-gray-400" : "font-medium text-gray-900"}`}>
                        {h.closed ? "Closed" : `${h.open} – ${h.close}`}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </FadeInSection>
        )}

        {/* ── 5. Contact & Address ── */}
        <FadeInSection className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Contact & Address</h2>
            <p className="text-gray-500 mt-2">Get in touch with us</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clinic?.address && (
              <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: hexToRgba(primaryColor, 0.08) }}>
                    <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</p>
                    <p className="text-sm text-gray-700 mt-0.5">{clinic.address}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {clinic?.phone && (
              <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: hexToRgba(primaryColor, 0.08) }}>
                    <Phone className="h-5 w-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</p>
                    <a href={`tel:${clinic.phone}`} className="text-sm text-gray-700 mt-0.5 hover:underline block">{clinic.phone}</a>
                  </div>
                </CardContent>
              </Card>
            )}
            {clinic?.email && (
              <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: hexToRgba(primaryColor, 0.08) }}>
                    <Mail className="h-5 w-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                    <a href={`mailto:${clinic.email}`} className="text-sm text-gray-700 mt-0.5 hover:underline block">{clinic.email}</a>
                  </div>
                </CardContent>
              </Card>
            )}
            {s.whatsapp_number && (
              <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-green-50">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">WhatsApp</p>
                    <a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 mt-0.5 hover:underline block">Chat with us</a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </FadeInSection>

        {/* ── Certifications ── */}
        {certs.length > 0 && (
          <FadeInSection className="mb-20">
            <div className="flex flex-wrap justify-center gap-4">
              {certs.map((cert, i) => (
                <div key={i} className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 bg-gray-50/50">
                  <Award className="h-4 w-4" style={{ color: primaryColor }} />
                  <span className="text-sm font-medium text-gray-700">{cert.title}</span>
                </div>
              ))}
            </div>
          </FadeInSection>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {clinic?.logo_url && <img src={clinic.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />}
                <span className="font-bold text-gray-900">{clinic?.name}</span>
              </div>
              {s.short_description && <p className="text-sm text-gray-500">{s.short_description}</p>}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Contact</h4>
              {clinic?.phone && <p className="text-sm text-gray-600 mb-1">{clinic.phone}</p>}
              {clinic?.email && <p className="text-sm text-gray-600 mb-1">{clinic.email}</p>}
              {clinic?.address && <p className="text-sm text-gray-600">{clinic.address}</p>}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Hours</h4>
              {hours.filter((h) => !h.closed).slice(0, 3).map((h) => (
                <p key={h.day} className="text-sm text-gray-600 mb-1">{h.day}: {h.open} – {h.close}</p>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {s.instagram_url && (
                  <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {s.facebook_url && (
                  <a href={s.facebook_url} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {s.google_review_url && (
                  <a href={s.google_review_url} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} {clinic?.name}. Powered by Clinexus</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      {s.whatsapp_number && (
        <a
          href={`https://wa.me/${s.whatsapp_number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl hover:bg-green-600 transition-all hover:scale-110"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      )}
    </div>
  );
}
