import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, Shield } from "lucide-react";
import { useAllProfiles, useAllOrgMembers } from "@/hooks/useAdminData";
import { useAllUsersWithRoles } from "@/hooks/useUserRoles";
import { format } from "date-fns";
import { getRoleLabel } from "@/config/roleAccess";

export default function AdminUsers() {
  const { data: profiles, isLoading } = useAllProfiles();
  const { data: usersWithRoles } = useAllUsersWithRoles();
  const { data: orgMembers } = useAllOrgMembers();
  const [search, setSearch] = useState("");

  // Build lookup maps
  const roleMap = new Map<string, string[]>();
  (usersWithRoles || []).forEach((u) => roleMap.set(u.user_id, u.roles));

  const orgMap = new Map<string, { org_name: string; role: string }[]>();
  (orgMembers || []).forEach((m: any) => {
    const existing = orgMap.get(m.user_id) || [];
    existing.push({
      org_name: m.organizations?.name || "Unknown",
      role: m.role,
    });
    orgMap.set(m.user_id, existing);
  });

  const filtered = (profiles || []).filter((p: any) =>
    (p.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-0.5">All platform users and their organization memberships.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs">User</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs">Platform Roles</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs hidden md:table-cell">Organizations</th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs hidden lg:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-3 px-4"><div className="h-4 bg-muted rounded w-32 animate-pulse" /></td>
                      <td className="py-3 px-4"><div className="h-4 bg-muted rounded w-16 animate-pulse" /></td>
                      <td className="py-3 px-4 hidden md:table-cell"><div className="h-4 bg-muted rounded w-24 animate-pulse" /></td>
                      <td className="py-3 px-4 hidden lg:table-cell"><div className="h-4 bg-muted rounded w-20 animate-pulse" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : filtered.map((p: any) => {
                  const initials = (p.full_name || "?").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                  const platformRoles = roleMap.get(p.id) || [];
                  const userOrgs = orgMap.get(p.id) || [];
                  const isSuperAdmin = platformRoles.includes("super_admin");

                  return (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={p.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{p.full_name || "Unnamed"}</p>
                            {p.phone && <p className="text-xs text-muted-foreground">{p.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {isSuperAdmin && (
                            <Badge className="text-[10px] bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
                              <Shield className="h-2.5 w-2.5 mr-0.5" /> Super Admin
                            </Badge>
                          )}
                          {platformRoles.filter(r => r !== "super_admin").map((r) => (
                            <Badge key={r} variant="outline" className="text-[10px]">{getRoleLabel(r)}</Badge>
                          ))}
                          {platformRoles.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {userOrgs.map((o, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">
                              {o.org_name} ({getRoleLabel(o.role)})
                            </Badge>
                          ))}
                          {userOrgs.length === 0 && <span className="text-xs text-muted-foreground">No org</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">
                        {format(new Date(p.created_at), "MMM d, yyyy")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
