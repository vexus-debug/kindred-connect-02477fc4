import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useClinicSettings, useUpdateClinicSettings } from "@/hooks/useClinicSettings";
import { useNotificationPreferences, useUpsertNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useOrgMembers, useUpdateOrgMemberRole, useRemoveOrgMember } from "@/hooks/useOrgMembers";
import { useClinicChairs, useCreateClinicChair, useUpdateClinicChair, useDeleteClinicChair } from "@/hooks/useClinicChairs";
import { useOrg } from "@/hooks/useOrg";
import { getRoleLabel } from "@/config/roleAccess";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { motion } from "framer-motion";

const orgRoles = ["owner", "admin", "dentist", "assistant", "hygienist", "receptionist", "accountant", "lab_technician"] as const;

export default function SettingsPage() {
  const { currentOrg } = useOrg();
  const isAdmin = currentOrg?.role === "owner" || currentOrg?.role === "admin";

  // Clinic settings
  const { data: clinicSettings } = useClinicSettings();
  const updateClinic = useUpdateClinicSettings();
  const [clinicForm, setClinicForm] = useState<Record<string, string>>({});

  const getClinicValue = (key: string) => clinicForm[key] ?? (clinicSettings as any)?.[key] ?? "";

  const handleSaveClinic = () => {
    if (!clinicSettings) return;
    updateClinic.mutate({ id: clinicSettings.id, ...clinicForm });
  };

  // Notification preferences
  const { data: notifPrefs } = useNotificationPreferences();
  const upsertPrefs = useUpsertNotificationPreferences();

  const handleTogglePref = (key: string, value: boolean) => {
    upsertPrefs.mutate({ [key]: value });
  };

  // Org members
  const { data: members = [] } = useOrgMembers();
  const updateMemberRole = useUpdateOrgMemberRole();
  const removeMember = useRemoveOrgMember();
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  // Chairs
  const { data: chairs = [] } = useClinicChairs();
  const createChair = useCreateClinicChair();
  const deleteChair = useDeleteClinicChair();
  const [newChairName, setNewChairName] = useState("");
  const [newChairRoom, setNewChairRoom] = useState("");

  const handleUpdateRole = () => {
    if (!editMemberId || !newRole) return;
    updateMemberRole.mutate({ memberId: editMemberId, role: newRole });
    setEditMemberId(null);
    setNewRole("");
  };

  const notifItems = [
    { key: "appointment_reminders", label: "Appointment Reminders", desc: "Send reminders before appointments" },
    { key: "payment_alerts", label: "Payment Alerts", desc: "Notify on overdue payments" },
    { key: "lab_completion_alerts", label: "Lab Completion Alerts", desc: "Notify when lab work is ready" },
    { key: "low_stock_alerts", label: "Low Stock Alerts", desc: "Alert when inventory is low" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage clinic profile and preferences" />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="clinic">
          <TabsList className="bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="clinic">Clinic Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {isAdmin && <TabsTrigger value="members">Members & Roles</TabsTrigger>}
            {isAdmin && <TabsTrigger value="chairs">Chairs</TabsTrigger>}
          </TabsList>

          <TabsContent value="clinic" className="mt-4">
            <Card className="glass-card">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-base">Clinic Information</CardTitle>
                <CardDescription>Update your clinic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-lg pt-6">
                <div className="space-y-2">
                  <Label htmlFor="clinicName" className="text-xs font-medium">Clinic Name</Label>
                  <Input id="clinicName" className="bg-muted/30 border-border/40" value={getClinicValue("name")} onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-medium">Address</Label>
                  <Input id="address" className="bg-muted/30 border-border/40" value={getClinicValue("address")} onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-medium">Phone</Label>
                    <Input id="phone" className="bg-muted/30 border-border/40" value={getClinicValue("phone")} onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <Input id="email" className="bg-muted/30 border-border/40" value={getClinicValue("email")} onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })} />
                  </div>
                </div>
                <Button className="bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={handleSaveClinic} disabled={updateClinic.isPending || !isAdmin}>
                  {updateClinic.isPending ? "Saving..." : "Save Changes"}
                </Button>
                {!isAdmin && <p className="text-xs text-muted-foreground">Only clinic owners and admins can update settings</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card className="glass-card">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription>Control what alerts you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 max-w-lg pt-4">
                {notifItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifPrefs ? (notifPrefs as any)[item.key] : true}
                      onCheckedChange={(checked) => handleTogglePref(item.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="members" className="mt-4">
              <Card className="glass-card">
                <CardHeader className="border-b border-border/30">
                  <CardTitle className="text-base">Clinic Members</CardTitle>
                  <CardDescription>Manage roles for members of this clinic</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {members.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No members found.</p>
                    ) : (
                      members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-accent/20 transition-colors">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{member.full_name}</p>
                            <Badge variant="secondary" className="text-[10px] mt-1 bg-secondary/10 text-secondary border-secondary/20">
                              {getRoleLabel(member.role)}
                            </Badge>
                          </div>
                          {editMemberId === member.id ? (
                            <div className="flex items-center gap-2">
                              <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger className="w-36 h-8 text-xs bg-muted/30"><SelectValue placeholder="Select role" /></SelectTrigger>
                                <SelectContent>
                                  {orgRoles.filter((r) => r !== member.role).map((r) => (
                                    <SelectItem key={r} value={r} className="capitalize text-xs">{getRoleLabel(r)}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button size="sm" className="h-8 text-xs bg-secondary hover:bg-secondary/90" onClick={handleUpdateRole} disabled={!newRole}>
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEditMemberId(null)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="h-8 text-xs border-border/50" onClick={() => { setEditMemberId(member.id); setNewRole(""); }}>
                                Change Role
                              </Button>
                              {member.role !== "owner" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeMember.mutate(member.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="chairs" className="mt-4">
              <Card className="glass-card">
                <CardHeader className="border-b border-border/30">
                  <CardTitle className="text-base">Chair / Operatory Management</CardTitle>
                  <CardDescription>Configure clinic chairs and rooms</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex gap-3 items-end">
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Chair Name</Label>
                      <Input placeholder="e.g. Chair 4" value={newChairName} onChange={e => setNewChairName(e.target.value)} className="bg-muted/30" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label className="text-xs">Room</Label>
                      <Input placeholder="e.g. Room C" value={newChairRoom} onChange={e => setNewChairRoom(e.target.value)} className="bg-muted/30" />
                    </div>
                    <Button className="bg-secondary hover:bg-secondary/90" disabled={!newChairName || createChair.isPending} onClick={() => {
                      createChair.mutate({ name: newChairName, room: newChairRoom }, {
                        onSuccess: () => { setNewChairName(""); setNewChairRoom(""); },
                      });
                    }}>
                      <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {chairs.map((chair: any) => (
                      <div key={chair.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card/50">
                        <div>
                          <p className="text-sm font-medium">{chair.name}</p>
                          <p className="text-xs text-muted-foreground">{chair.room || "No room"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={chair.status === "active" ? "default" : "secondary"} className="text-[10px]">{chair.status}</Badge>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteChair.mutate(chair.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
}
