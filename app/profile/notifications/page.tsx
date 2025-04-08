"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { AppShell } from "@/components/layout/app-shell"

export default function Notifications() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    pushNotifications: {
      transactions: true,
      cashback: true,
      investments: true,
      security: true,
      marketing: false,
    },
    emailNotifications: {
      transactions: true,
      cashback: true,
      investments: true,
      security: true,
      marketing: false,
      newsletter: true,
    },
  })

  const handleToggle = (category, setting) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }))

    toast({
      title: "Notification settings updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} notifications ${!settings[category][setting] ? "enabled" : "disabled"}.`,
    })
  }

  return (
    <AppShell>
      <div className="mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")} className="mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
      </div>

      <Card className="bg-secondary/50 border-0 mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Push Notifications</CardTitle>
          <CardDescription className="text-gray-400">Manage notifications sent to your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Transaction Alerts</h3>
              <p className="text-sm text-gray-400">Receive alerts for new transactions</p>
            </div>
            <Switch
              checked={settings.pushNotifications.transactions}
              onCheckedChange={() => handleToggle("pushNotifications", "transactions")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Cashback Earned</h3>
              <p className="text-sm text-gray-400">Get notified when you earn cashback</p>
            </div>
            <Switch
              checked={settings.pushNotifications.cashback}
              onCheckedChange={() => handleToggle("pushNotifications", "cashback")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Investment Updates</h3>
              <p className="text-sm text-gray-400">Receive updates on your investments</p>
            </div>
            <Switch
              checked={settings.pushNotifications.investments}
              onCheckedChange={() => handleToggle("pushNotifications", "investments")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Security Alerts</h3>
              <p className="text-sm text-gray-400">Get notified about security events</p>
            </div>
            <Switch
              checked={settings.pushNotifications.security}
              onCheckedChange={() => handleToggle("pushNotifications", "security")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing & Promotions</h3>
              <p className="text-sm text-gray-400">Receive offers and promotions</p>
            </div>
            <Switch
              checked={settings.pushNotifications.marketing}
              onCheckedChange={() => handleToggle("pushNotifications", "marketing")}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/50 border-0">
        <CardHeader>
          <CardTitle className="text-lg">Email Notifications</CardTitle>
          <CardDescription className="text-gray-400">Manage emails sent to your inbox</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Transaction Summaries</h3>
              <p className="text-sm text-gray-400">Receive transaction summaries</p>
            </div>
            <Switch
              checked={settings.emailNotifications.transactions}
              onCheckedChange={() => handleToggle("emailNotifications", "transactions")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Cashback Reports</h3>
              <p className="text-sm text-gray-400">Get monthly cashback reports</p>
            </div>
            <Switch
              checked={settings.emailNotifications.cashback}
              onCheckedChange={() => handleToggle("emailNotifications", "cashback")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Investment Reports</h3>
              <p className="text-sm text-gray-400">Receive investment performance reports</p>
            </div>
            <Switch
              checked={settings.emailNotifications.investments}
              onCheckedChange={() => handleToggle("emailNotifications", "investments")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Security Notifications</h3>
              <p className="text-sm text-gray-400">Get notified about security events</p>
            </div>
            <Switch
              checked={settings.emailNotifications.security}
              onCheckedChange={() => handleToggle("emailNotifications", "security")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing Emails</h3>
              <p className="text-sm text-gray-400">Receive offers and promotions</p>
            </div>
            <Switch
              checked={settings.emailNotifications.marketing}
              onCheckedChange={() => handleToggle("emailNotifications", "marketing")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Newsletter</h3>
              <p className="text-sm text-gray-400">Receive our weekly newsletter</p>
            </div>
            <Switch
              checked={settings.emailNotifications.newsletter}
              onCheckedChange={() => handleToggle("emailNotifications", "newsletter")}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
