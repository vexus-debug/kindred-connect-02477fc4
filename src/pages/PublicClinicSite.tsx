import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, CheckCircle, Calendar } from "lucide-react";

interface SiteSettings {
  welcome_text?: string;
  primary_color?: string;
  accent_color?: string;
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

interface Staff {
  id: string;
  full_name: string;
  role: string;
  specialty: string | null;
}

export default function PublicClinicSite() {
  const { slug } = useParams<{ slug: string }>();
  const [clinic, setClinic] = useState<ClinicInfo | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Booking form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const siteSettings = clinic?.settings || {};
  const primaryColor = siteSettings.primary_color || "#2563eb";
  const accentColor = siteSettings.accent_color || "#1d4ed8";
  const welcomeText = siteSettings.welcome_text || "Welcome to our clinic";

  // Dynamic CSS variables
  const dynamicStyles = useMemo(() => ({
    "--site-primary": primaryColor,
    "--site-accent": accentColor,
  } as React.CSSProperties), [primaryColor, accentColor]);

  useEffect(() => {
    if (!slug) return;

    const fetchClinic = async () => {
      const { data: org, error } = await supabase
        .from("organizations")
        .select("id, name, address, phone, email, logo_url, settings")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !org) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setClinic(org as ClinicInfo);

      const [treatmentsRes, staffRes] = await Promise.all([
        supabase
          .from("treatments")
          .select("id, name, price, category, description, duration")
          .eq("org_id", org.id)
          .eq("status", "active")
          .order("category"),
        supabase
          .from("staff")
          .select("id, full_name, role, specialty")
          .eq("org_id", org.id)
          .eq("status", "active")
          .in("role", ["dentist", "doctor", "hygienist", "owner"]),
      ]);

      setTreatments(treatmentsRes.data || []);
      setStaff(staffRes.data || []);
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
        body: {
          org_slug: slug,
          patient_name: name,
          patient_phone: phone,
          staff_id: selectedStaff,
          treatment_id: selectedTreatment || null,
          appointment_date: date,
          appointment_time: time,
        },
      });

      if (res.error || res.data?.error) {
        throw new Error(res.data?.error || res.error?.message || "Booking failed");
      }

      setBooked(true);
      toast({ title: "Appointment booked successfully!" });
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Clinic Not Found</h1>
          <p className="text-muted-foreground">This clinic page doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const categories = [...new Set(treatments.map((t) => t.category || "General"))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" style={dynamicStyles}>
      {/* Header */}
      <header className="border-b shadow-sm" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center gap-4">
          {clinic?.logo_url && (
            <img src={clinic.logo_url} alt={clinic?.name} className="h-12 w-12 rounded-full object-cover border-2 border-white/30" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{clinic?.name}</h1>
            <p className="text-sm text-white/80">{welcomeText}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {clinic?.address && (
              <div className="flex items-center gap-3 text-sm text-foreground">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                <span>{clinic.address}</span>
              </div>
            )}
            {clinic?.phone && (
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Phone className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                <a href={`tel:${clinic.phone}`} className="hover:underline">{clinic.phone}</a>
              </div>
            )}
            {clinic?.email && (
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Mail className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                <a href={`mailto:${clinic.email}`} className="hover:underline">{clinic.email}</a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services */}
        {treatments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Our Services</h2>
            {categories.map((cat) => {
              const catTreatments = treatments.filter((t) => (t.category || "General") === cat);
              return (
                <div key={cat} className="mb-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{cat}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {catTreatments.map((t) => (
                      <Card key={t.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm text-foreground">{t.name}</p>
                              {t.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                              )}
                            </div>
                            <span className="text-sm font-bold shrink-0 ml-2" style={{ color: primaryColor }}>
                              ₦{t.price.toLocaleString()}
                            </span>
                          </div>
                          {t.duration && (
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{t.duration} min</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking Widget */}
        <Card className="border-2" style={{ borderColor: primaryColor + "33" }}>
          <CardHeader style={{ backgroundColor: primaryColor + "08" }}>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" style={{ color: primaryColor }} />
              Book an Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {booked ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="h-12 w-12 mx-auto" style={{ color: primaryColor }} />
                <h3 className="text-lg font-semibold text-foreground">Appointment Booked!</h3>
                <p className="text-sm text-muted-foreground">We'll be in touch to confirm your appointment.</p>
                <Button variant="outline" onClick={() => { setBooked(false); setName(""); setPhone(""); setSelectedStaff(""); setSelectedTreatment(""); setDate(""); setTime(""); }}>
                  Book Another
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Full Name *</label>
                  <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Phone *</label>
                  <Input placeholder="080xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Doctor *</label>
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                    <SelectContent>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.full_name}{s.specialty ? ` — ${s.specialty}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Service</label>
                  <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
                    <SelectTrigger><SelectValue placeholder="Select service (optional)" /></SelectTrigger>
                    <SelectContent>
                      {treatments.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} — ₦{t.price.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Preferred Date *</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Preferred Time *</label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Button
                    className="w-full text-white"
                    style={{ backgroundColor: primaryColor }}
                    onClick={handleBook}
                    disabled={booking}
                  >
                    {booking ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-muted-foreground py-4">
          Powered by VexusHealth
        </footer>
      </main>
    </div>
  );
}
