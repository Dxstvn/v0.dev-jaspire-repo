"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Clock,
  DollarSign,
  GraduationCap,
  Lightbulb,
  Play,
  TrendingUp,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function Learn() {
  const [activeTab, setActiveTab] = useState("all")

  // Featured article
  const featuredArticle = {
    title: "The Power of Compound Interest",
    description: "Learn how your investments can grow exponentially over time through the magic of compound interest.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Investing",
    readTime: "5 min read",
    link: "/learn/compound-interest",
  }

  // Articles
  const articles = [
    {
      id: 1,
      title: "Investment Basics for Beginners",
      description: "A comprehensive guide to understanding the fundamentals of investing.",
      category: "Investing",
      readTime: "8 min read",
      icon: <GraduationCap className="h-5 w-5" />,
      link: "/learn/investment-basics",
    },
    {
      id: 2,
      title: "Maximizing Your Cashback Rewards",
      description: "Tips and strategies to earn more cashback on everyday purchases.",
      category: "Cashback",
      readTime: "6 min read",
      icon: <DollarSign className="h-5 w-5" />,
      link: "/learn/maximize-cashback",
    },
    {
      id: 3,
      title: "Understanding Market Volatility",
      description: "How to navigate market ups and downs with confidence.",
      category: "Investing",
      readTime: "7 min read",
      icon: <TrendingUp className="h-5 w-5" />,
      link: "/learn/market-volatility",
    },
    {
      id: 4,
      title: "Building a Diversified Portfolio",
      description: "The importance of diversification and how to achieve it.",
      category: "Investing",
      readTime: "9 min read",
      icon: <Lightbulb className="h-5 w-5" />,
      link: "/learn/diversification",
    },
    {
      id: 5,
      title: "Smart Spending Habits",
      description: "How to make the most of your money while still earning cashback.",
      category: "Cashback",
      readTime: "5 min read",
      icon: <DollarSign className="h-5 w-5" />,
      link: "/learn/smart-spending",
    },
    {
      id: 6,
      title: "Long-term vs. Short-term Investing",
      description: "Understanding different investment horizons and strategies.",
      category: "Investing",
      readTime: "7 min read",
      icon: <Clock className="h-5 w-5" />,
      link: "/learn/investment-horizons",
    },
  ]

  // Videos
  const videos = [
    {
      id: 1,
      title: "How Cashback Investing Works",
      description: "A step-by-step explanation of how Jaspire turns your cashback into investments.",
      duration: "4:32",
      thumbnail: "/placeholder.svg?height=200&width=300",
      link: "/learn/videos/cashback-investing",
    },
    {
      id: 2,
      title: "Setting Up Your Investment Strategy",
      description: "Learn how to customize your investment preferences for optimal results.",
      duration: "6:15",
      thumbnail: "/placeholder.svg?height=200&width=300",
      link: "/learn/videos/investment-strategy",
    },
    {
      id: 3,
      title: "Understanding Your Portfolio Dashboard",
      description: "A tour of the Jaspire dashboard and how to interpret your investment data.",
      duration: "5:48",
      thumbnail: "/placeholder.svg?height=200&width=300",
      link: "/learn/videos/portfolio-dashboard",
    },
  ]

  // Filter articles based on active tab
  const filteredArticles =
    activeTab === "all" ? articles : articles.filter((article) => article.category.toLowerCase() === activeTab)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <AppShell>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Learn & Grow</h1>
          <p className="text-muted-foreground">Educational resources to help you make the most of your investments</p>
        </motion.div>

        {/* Featured Article */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-secondary to-background border-0 overflow-hidden relative card-hover">
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-6 flex flex-col justify-center">
                <Badge className="w-fit mb-2 bg-primary/20 text-primary hover:bg-primary/30">
                  {featuredArticle.category}
                </Badge>
                <h2 className="text-2xl font-bold mb-2">{featuredArticle.title}</h2>
                <p className="text-muted-foreground mb-4">{featuredArticle.description}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredArticle.readTime}</span>
                </div>
                <Link href={featuredArticle.link}>
                  <Button className="w-full md:w-auto bg-primary hover:bg-primary/90">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 h-48 md:h-auto bg-muted">
                <img
                  src={featuredArticle.image || "/placeholder.svg"}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Articles Section */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Articles</h2>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="investing">Investing</TabsTrigger>
                <TabsTrigger value="cashback">Cashback</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <Link href={article.link} key={article.id}>
                <Card className="bg-secondary/50 border-0 h-full card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{article.category}</Badge>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        {article.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                      <p className="text-muted-foreground text-sm">{article.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Videos Section */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold mb-4">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Link href={video.link} key={video.id}>
                <Card className="bg-secondary/50 border-0 h-full card-hover">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                    <p className="text-muted-foreground text-sm">{video.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}
