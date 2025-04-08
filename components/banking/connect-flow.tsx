"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ConnectButton } from "@/components/mastercard/connect-button"

export function ConnectFlow() {
  // const router = useRouter()
  // const [step, setStep] = useState<"intro" | "select" | "loading" | "success">("intro")
  // const [institutions, setInstitutions] = useState<FinancialInstitution[]>([])
  // const [filteredInstitutions, setFilteredInstitutions] = useState<FinancialInstitution[]>([])
  // const [searchQuery, setSearchQuery] = useState("")
  // const [selectedInstitution, setSelectedInstitution] = useState<FinancialInstitution | null>(null)
  // const [isLoading, setIsLoading] = useState(false)
  // const [activeTab, setActiveTab] = useState<"all" | "banks" | "cards">("all")

  // useEffect(() => {
  //   const fetchInstitutions = async () => {
  //     try {
  //       const data = await mastercardApi.getFinancialInstitutions()
  //       setInstitutions(data)
  //       setFilteredInstitutions(data)
  //     } catch (error) {
  //       console.error("Error fetching institutions:", error)
  //     }
  //   }

  //   fetchInstitutions()
  // }, [])

  // useEffect(() => {
  //   let filtered = institutions

  //   // Filter by tab
  //   if (activeTab === "banks") {
  //     filtered = filtered.filter((inst) => inst.type === "bank")
  //   } else if (activeTab === "cards") {
  //     filtered = filtered.filter((inst) => inst.type === "credit_card")
  //   }

  //   // Filter by search query
  //   if (searchQuery) {
  //     const query = searchQuery.toLowerCase()
  //     filtered = filtered.filter((inst) => inst.name.toLowerCase().includes(query))
  //   }

  //   setFilteredInstitutions(filtered)
  // }, [searchQuery, institutions, activeTab])

  // const handleStartConnect = () => {
  //   setStep("select")
  // }

  // const handleInstitutionSelect = (institution: FinancialInstitution) => {
  //   setSelectedInstitution(institution)
  //   handleConnect(institution)
  // }

  // const handleConnect = async (institution: FinancialInstitution) => {
  //   try {
  //     setIsLoading(true)
  //     setStep("loading")

  //     // Generate a Connect URL
  //     const redirectUrl = `${window.location.origin}/banking/connect-callback`
  //     const connectUrl = await mastercardApi.generateConnectUrl(redirectUrl)

  //     // In a real implementation, we would redirect to the Connect URL
  //     // window.location.href = connectUrl

  //     // For demo purposes, simulate the connection process
  //     setTimeout(() => {
  //       setIsLoading(false)
  //       setStep("success")
  //     }, 3000)
  //   } catch (error) {
  //     console.error("Error connecting to institution:", error)
  //     toast({
  //       title: "Connection Error",
  //       description: "Unable to connect to the selected institution. Please try again.",
  //       variant: "destructive",
  //     })
  //     setIsLoading(false)
  //     setStep("select")
  //   }
  // }

  // const handleComplete = () => {
  //   router.push("/banking")
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Bank</CardTitle>
        <CardDescription>
          Securely connect your bank account to enable transactions and cashback features.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-center text-sm text-muted-foreground mb-4">
          We use bank-level security to protect your information. Your credentials are never stored on our servers.
        </p>
        <ConnectButton className="w-full" />
      </CardContent>
    </Card>
  )
}
