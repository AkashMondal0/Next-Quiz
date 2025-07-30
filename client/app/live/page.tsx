import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 sm:px-6 lg:px-0">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 sm:gap-6 sm:py-6">
          <div className="data-[slot=card]:shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-0 dark:data-[slot=card]:bg-card data-[slot=card]:bg-gradient-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card lg:px-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <CardItem
                key={index}
                title={`Quiz ${index + 1}`}
                description={`Description for Quiz ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const CardItem = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold">
          {title} - Live Quiz
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <Badge variant="destructive" className="absolute top-2 right-2">
          LIVE
        </Badge>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Quiz in progress <TrendingUpIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          Join now and test your skills in real-time!
        </div>
      </CardFooter>
    </Card>
  )
}