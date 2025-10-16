"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, Key, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    research: true,
    updates: false,
  });

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold font-heading text-foreground">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bar-id" className="text-sm font-medium">
                      Bar Council ID
                    </label>
                    <Input
                      id="bar-id"
                      type="text"
                      placeholder="BAR/1234/2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="practice-area" className="text-sm font-medium">
                      Practice Area
                    </label>
                    <Select defaultValue="property">
                      <SelectTrigger id="practice-area">
                        <SelectValue placeholder="Select practice area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="property">Property Law</SelectItem>
                        <SelectItem value="corporate">Corporate Law</SelectItem>
                        <SelectItem value="criminal">Criminal Law</SelectItem>
                        <SelectItem value="family">Family Law</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="email-notif" className="text-sm font-medium">
                      Email Notifications
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your research
                    </p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="research-notif" className="text-sm font-medium">
                      Research Alerts
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when research is complete
                    </p>
                  </div>
                  <Switch
                    id="research-notif"
                    checked={notifications.research}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, research: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label htmlFor="updates-notif" className="text-sm font-medium">
                      Product Updates
                    </label>
                    <p className="text-sm text-muted-foreground">
                      News about new features and updates
                    </p>
                  </div>
                  <Switch
                    id="updates-notif"
                    checked={notifications.updates}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, updates: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and security settings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <span>Change Password</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Billing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-secondary border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Plan: Free Trial</p>
                      <p className="text-sm text-muted-foreground">14 days remaining</p>
                    </div>
                    <Button>Upgrade</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
