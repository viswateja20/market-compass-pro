import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, Check, Copy, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface UserProfile {
  name: string;
  username: string;
  email: string;
}

interface UserPrefs {
  darkMode: boolean;
  publicProfile: boolean;
  language: string;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
  });
  const [prefs, setPrefs] = useState<UserPrefs>({
    darkMode: true,
    publicProfile: false,
    language: 'en',
  });
  const [editing, setEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);

  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) setProfile(JSON.parse(saved));
    const savedPrefs = localStorage.getItem('userPrefs');
    if (savedPrefs) setPrefs(JSON.parse(savedPrefs));
  }, []);

  useEffect(() => {
    if (prefs.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [prefs.darkMode]);

  const saveProfile = () => {
    setProfile(editProfile);
    localStorage.setItem('userProfile', JSON.stringify(editProfile));
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const savePrefs = (newPrefs: UserPrefs) => {
    setPrefs(newPrefs);
    localStorage.setItem('userPrefs', JSON.stringify(newPrefs));
    toast.success('Settings saved!');
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${profile.username}`);
    toast.success('Profile link copied!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
          <TabsTrigger value="overview" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="w-3 h-3" /> Overview
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="w-3 h-3" /> Settings
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="w-3 h-3" /> Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Profile Information</CardTitle>
                  {!editing && (
                    <Button size="sm" variant="outline" onClick={() => { setEditing(true); setEditProfile(profile); }}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  </div>
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <Input value={editProfile.name} onChange={e => setEditProfile({ ...editProfile, name: e.target.value })} className="bg-transparent border-border/50" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Username</Label>
                      <Input value={editProfile.username} onChange={e => setEditProfile({ ...editProfile, username: e.target.value })} className="bg-transparent border-border/50" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <Input value={editProfile.email} disabled className="bg-muted/50 border-border/50" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveProfile} size="sm" className="gradient-primary border-0">
                        <Check className="w-3 h-3 mr-1" /> Save
                      </Button>
                      <Button onClick={() => setEditing(false)} size="sm" variant="outline">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground">{profile.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Username</span>
                      <span className="text-foreground">@{profile.username}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="settings">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass">
              <CardHeader><CardTitle className="text-base">Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                  <Switch checked={prefs.darkMode} onCheckedChange={(v) => savePrefs({ ...prefs, darkMode: v })} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Language</p>
                    <p className="text-xs text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select value={prefs.language} onValueChange={(v) => savePrefs({ ...prefs, language: v })}>
                    <SelectTrigger className="w-36 bg-transparent border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass">
              <CardHeader><CardTitle className="text-base">Sharing & Privacy</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Public Profile</p>
                    <p className="text-xs text-muted-foreground">Allow others to view your profile</p>
                  </div>
                  <Switch checked={prefs.publicProfile} onCheckedChange={(v) => savePrefs({ ...prefs, publicProfile: v })} />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Share Profile Link</p>
                  <div className="flex gap-2">
                    <Input value={`${window.location.origin}/profile/${profile.username}`} readOnly className="bg-muted/50 border-border/50 text-xs" />
                    <Button size="icon" variant="outline" onClick={copyProfileLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
