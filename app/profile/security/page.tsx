"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { AppShell } from "@/components/layout/app-shell"

export default function Security() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would update the password
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully.",
    })

    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleTwoFactorToggle = () => {
    const newValue = !twoFactorEnabled
    setTwoFactorEnabled(newValue)
    toast({
      title: `Two-factor authentication ${newValue ? "enabled" : "disabled"}`,
      description: newValue ? "Your account is now more secure." : "Two-factor authentication has been disabled.",
    })
  }

  return (
    <AppShell>
      <div className="mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")} className="mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Security</h1>
        </div>
      </div>

      {/* Change Password */}
      <Card className="bg-secondary/50 border-0 mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription className="text-gray-400">Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="bg-background/50 border-muted pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <Button type="submit" className="bg-primary hover:bg-primary/90 w-full">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900 border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleTwoFactorToggle}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Biometric Login</h3>
              <p className="text-sm text-gray-400">Use fingerprint or face recognition to log in</p>
            </div>
            <Switch
              checked={biometricEnabled}
              onCheckedChange={setBiometricEnabled}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Login Notifications</h3>
              <p className="text-sm text-gray-400">Receive alerts for new login attempts</p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Device Management */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">Device Management</CardTitle>
          <CardDescription className="text-gray-400">Manage devices that are currently logged in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 border border-gray-800 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">iPhone 13 Pro</h3>
                <p className="text-xs text-gray-400">Last active: Today, 2:45 PM</p>
                <p className="text-xs text-gray-400">San Francisco, CA</p>
              </div>
              <div className="bg-green-900/30 px-2 py-1 rounded-full">
                <span className="text-green-400 text-xs">Current Device</span>
              </div>
            </div>
          </div>

          <div className="p-3 border border-gray-800 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">MacBook Pro</h3>
                <p className="text-xs text-gray-400">Last active: Yesterday, 8:12 AM</p>
                <p className="text-xs text-gray-400">San Francisco, CA</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs border-gray-700 hover:bg-gray-800">
                Log Out
              </Button>
            </div>
          </div>

          <div className="p-3 border border-gray-800 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Chrome on Windows</h3>
                <p className="text-xs text-gray-400">Last active: March 15, 2023</p>
                <p className="text-xs text-gray-400">New York, NY</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs border-gray-700 hover:bg-gray-800">
                Log Out
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full border-gray-700 text-red-400 hover:text-red-300 hover:bg-gray-800"
          >
            Log Out All Other Devices
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  )
}
