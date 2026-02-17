import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { clinicTypeOptions } from "@/config/clinicTypeConfig";
import clinexusLogo from "@/assets/clinexus-logo.png";

function MedicalBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/20" />
      
      {/* Floating blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/[0.07] blur-3xl animate-pulse-gentle" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/[0.1] blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-2xl animate-bounce-subtle" />

      {/* Medical SVG elements scattered */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        {/* Heart rate / pulse line */}
        <path d="M-50 300 L100 300 L130 250 L160 350 L190 200 L220 400 L250 300 L400 300" 
          stroke="currentColor" strokeWidth="3" fill="none" className="text-primary" />
        <path d="M500 500 L650 500 L680 450 L710 550 L740 400 L770 600 L800 500 L950 500" 
          stroke="currentColor" strokeWidth="3" fill="none" className="text-primary" />
        
        {/* Cross / Plus symbols */}
        <g className="text-primary" fill="currentColor">
          <rect x="80" y="60" width="8" height="30" rx="4" />
          <rect x="69" y="71" width="30" height="8" rx="4" />
          
          <rect x="700" y="120" width="10" height="36" rx="5" />
          <rect x="687" y="133" width="36" height="10" rx="5" />
          
          <rect x="900" y="400" width="8" height="30" rx="4" />
          <rect x="889" y="411" width="30" height="8" rx="4" />
          
          <rect x="150" y="600" width="10" height="36" rx="5" />
          <rect x="137" y="613" width="36" height="10" rx="5" />
        </g>

        {/* Stethoscope simplified */}
        <g className="text-primary" stroke="currentColor" fill="none" strokeWidth="2.5">
          <path d="M750 650 Q750 700 780 720 Q810 740 810 780 Q810 830 770 830 Q730 830 730 780" />
          <circle cx="770" cy="830" r="15" />
          <path d="M720 650 L720 680 Q720 700 740 700" />
          <path d="M750 650 L750 680 Q750 700 740 700" />
        </g>

        {/* DNA helix */}
        <g className="text-primary" stroke="currentColor" fill="none" strokeWidth="2" opacity="0.7">
          <path d="M50 400 Q70 420 50 440 Q30 460 50 480 Q70 500 50 520 Q30 540 50 560 Q70 580 50 600" />
          <path d="M70 400 Q50 420 70 440 Q90 460 70 480 Q50 500 70 520 Q90 540 70 560 Q50 580 70 600" />
          <line x1="50" y1="420" x2="70" y2="420" />
          <line x1="50" y1="460" x2="70" y2="460" />
          <line x1="50" y1="500" x2="70" y2="500" />
          <line x1="50" y1="540" x2="70" y2="540" />
          <line x1="50" y1="580" x2="70" y2="580" />
        </g>

        {/* Pill capsules */}
        <g className="text-primary" fill="currentColor" opacity="0.5">
          <rect x="920" y="200" width="40" height="18" rx="9" transform="rotate(30 940 209)" />
          <rect x="300" y="80" width="35" height="16" rx="8" transform="rotate(-20 317 88)" />
          <rect x="600" y="700" width="38" height="17" rx="8.5" transform="rotate(45 619 708)" />
        </g>

        {/* Heartbeat icon */}
        <g className="text-primary" fill="currentColor" opacity="0.5">
          <path d="M870 60 C870 45 885 35 900 48 C915 35 930 45 930 60 C930 80 900 95 900 95 C900 95 870 80 870 60Z" />
          <path d="M200 750 C200 738 212 730 224 740 C236 730 248 738 248 750 C248 765 224 778 224 778 C224 778 200 765 200 750Z" />
        </g>

        {/* Circle dots pattern */}
        <g className="text-primary" fill="currentColor" opacity="0.15">
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 12 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={col * 80 + 40} cy={row * 100 + 50} r="2" />
            ))
          )}
        </g>

        {/* Tooth icon */}
        <g className="text-primary" fill="currentColor" opacity="0.4">
          <path d="M480 150 C470 130 455 125 450 135 C445 145 440 170 435 185 C430 200 440 205 445 195 C450 185 455 175 460 175 C465 175 465 190 460 205 C455 220 465 225 470 210 C475 195 475 175 480 170 C485 175 485 195 490 210 C495 225 505 220 500 205 C495 190 495 175 500 175 C505 175 510 185 515 195 C520 205 530 200 525 185 C520 170 515 145 510 135 C505 125 490 130 480 150Z" />
        </g>
      </svg>
      
      {/* Animated floating medical crosses */}
      <div className="absolute top-[15%] left-[10%] text-primary/10 animate-bounce-subtle">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
          <rect x="15" y="5" width="10" height="30" rx="3" />
          <rect x="5" y="15" width="30" height="10" rx="3" />
        </svg>
      </div>
      <div className="absolute top-[70%] right-[8%] text-primary/8 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
        <svg width="32" height="32" viewBox="0 0 40 40" fill="currentColor">
          <rect x="15" y="5" width="10" height="30" rx="3" />
          <rect x="5" y="15" width="30" height="10" rx="3" />
        </svg>
      </div>
      <div className="absolute top-[40%] right-[15%] text-primary/[0.06] animate-pulse-gentle" style={{ animationDelay: '0.5s' }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="30" cy="30" r="28" />
          <rect x="22" y="12" width="16" height="36" rx="4" fill="currentColor" opacity="0.3" />
          <rect x="12" y="22" width="36" height="16" rx="4" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicType, setClinicType] = useState("dental");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refetchUserData } = useAuth();

  const selectedOption = clinicTypeOptions.find((o) => o.value === clinicType);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (selectedOption?.comingSoon) {
          toast({ title: "Coming Soon", description: `${selectedOption.label} dashboard is not yet available. Please select Dental Clinic for now.`, variant: "destructive" });
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (signUpError) throw signUpError;

        const userId = signUpData.user?.id;
        if (!userId) {
          toast({ title: "Sign up failed", description: "Could not create account. Please try again.", variant: "destructive" });
          setLoading(false);
          return;
        }

        const slug = clinicName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `clinic-${Date.now()}`;

        const { error: orgError } = await supabase.rpc("create_org_for_new_user" as any, {
          p_user_id: userId,
          p_clinic_name: clinicName.trim(),
          p_slug: slug,
          p_clinic_type: clinicType,
        });

        if (orgError) throw orgError;

        await refetchUserData();

        toast({ title: "Account & clinic created!", description: "Welcome to Clinexus!" });
        navigate("/select-clinic");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/select-clinic");
      }
    } catch (error: any) {
      toast({ title: isSignUp ? "Sign up failed" : "Login failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-y-auto py-8">
      <MedicalBackground />

      <Card className="relative w-full max-w-md border-border/40 shadow-2xl shadow-primary/[0.08] backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto flex flex-col items-center gap-1">
            <img src={clinexusLogo} alt="Clinexus" className="h-12 w-auto object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
            <CardDescription className="mt-1">{isSignUp ? "Sign up for Clinexus" : "Sign in to your clinic"}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" type="text" placeholder="Dr. John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input id="clinicName" type="text" placeholder="e.g. Smile Dental Clinic" value={clinicName} onChange={(e) => setClinicName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Clinic Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {clinicTypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setClinicType(opt.value)}
                        className={`relative flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-all duration-200 ${
                          clinicType === opt.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-muted-foreground/30"
                        } ${opt.comingSoon ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <opt.icon className={`h-4 w-4 shrink-0 ${clinicType === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`font-medium text-xs ${clinicType === opt.value ? "text-primary" : "text-foreground"}`}>{opt.label}</span>
                        </div>
                        {opt.comingSoon && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 mt-0.5">Coming Soon</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full font-semibold shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
            {isSignUp && (
              <p className="text-center text-xs text-muted-foreground mt-2">🎉 3-day free trial · No credit card required · Cancel anytime</p>
            )}
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isSignUp ? (
              <>Already have an account?{" "}<button onClick={() => setIsSignUp(false)} className="text-primary font-medium hover:underline">Sign in</button></>
            ) : (
              <>Don't have an account?{" "}<button onClick={() => setIsSignUp(true)} className="text-primary font-medium hover:underline">Sign up — 3 days free trial!</button></>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
