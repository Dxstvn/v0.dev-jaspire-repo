import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CreditCard } from "lucide-react"
import Link from "next/link"

interface WelcomeBannerProps {
  userName: string
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const firstName = userName?.split(" ")[0] || "there"

  return (
    <Card className="bg-gradient-to-br from-green-900/70 to-green-950 border-0 mb-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <CardContent className="pt-6 pb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, {firstName}!</h2>
        <p className="text-gray-300 mb-4">
          Get started with Jaspire by linking your first card to begin tracking and investing your cashback.
        </p>

        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
            <span className="text-white font-bold">1</span>
          </div>
          <p className="text-gray-200">Link your existing card</p>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
            <span className="text-white font-bold">2</span>
          </div>
          <p className="text-gray-200">Track cashback from your purchases</p>
        </div>

        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center">
            <span className="text-white font-bold">3</span>
          </div>
          <p className="text-gray-200">Watch your investments grow</p>
        </div>

        <Link href="/add-card">
          <Button className="w-full bg-white text-black hover:bg-white/90">
            <CreditCard className="h-4 w-4 mr-2" />
            Link Your First Card
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
