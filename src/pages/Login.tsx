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
import { clinicTypeOptions } from "@/config/clinicTypeConfig";
import logo from "@/assets/logo.jpg";

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

        // 1. Sign up the user
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

        // 2. Create org + membership via secure RPC (bypasses RLS for new users)
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

        toast({ title: "Account & clinic created!", description: "Welcome to Vexus Health!" });
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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto">
            <img src={logo} alt="Vexus Health" className="h-16 w-16 rounded-full object-cover mx-auto" />
          </div>
          <CardTitle className="text-2xl text-primary">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
          <CardDescription>{isSignUp ? "Sign up for Vexus Health" : "Sign in to Vexus Health Platform"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Dr. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input
                    id="clinicName"
                    type="text"
                    placeholder="e.g. Smile Dental Clinic"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    required
                  />
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
                          <span className={`font-medium text-xs ${clinicType === opt.value ? "text-primary" : "text-foreground"}`}>
                            {opt.label}
                          </span>
                        </div>
                        {opt.comingSoon && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 mt-0.5">
                            Coming Soon
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
            {isSignUp && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                🎉 3-day free trial · No credit card required · Cancel anytime
              </p>
            )}
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isSignUp ? (
              <>Already have an account?{" "}
                <button onClick={() => setIsSignUp(false)} className="text-primary hover:underline">Sign in</button>
              </>
            ) : (
              <>Don't have an account?{" "}
                <button onClick={() => setIsSignUp(true)} className="text-primary hover:underline">Sign up — 3 days free trial!</button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
