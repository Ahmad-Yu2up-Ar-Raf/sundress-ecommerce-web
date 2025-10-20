import { OrderType } from '@/lib/validations/orders'
import React from 'react'
import { Button } from "@/components/ui/fragments/shadcn-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/fragments/shadcn-ui/card"
import { Badge } from '../../shadcn-ui/badge'
import { ChevronRight } from 'lucide-react'
import { Progress } from '../../shadcn-ui/progress'
import { getOrderStatusColor, getOrderStatusIcon } from '@/lib/utils/orders/order-status-utils'
import { OrderStatus } from '@/config/enums/order-status'
import { cn } from '@/lib/utils'
import { getShippingMethodIcon } from '@/lib/utils/orders/courier-utils'
import { ShippingMethod } from '@/config/enums/courier'

function OrderCard({ Order }: { Order: OrderType }) {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  const orderStatus = Order.status as OrderStatus
  const shippingMethod = Order.shipping_method as ShippingMethod

  const icon = getOrderStatusIcon(orderStatus)
  const iconShipping = getShippingMethodIcon(shippingMethod)

  // ambil semua style berdasarkan status
  const style = getOrderStatusColor(orderStatus)

  return (
    <Card
      className={cn(
        "w-full m-auto gap-0 cursor-pointer relative overflow-hidden outline-1 justify-between pb-8 pt-5 h-[21em]",
        style.bg,
        style.outline
      )}
    >
      <CardHeader className="h-[3.5em] gap-8 justify-between">
        <div className="overflow-hidden gap-3.5 flex items-center">
          <CardTitle className="text-lg text-muted-foreground">#{Order.id}</CardTitle>
          <div className="bg-border shrink-0 w-px h-3" />
          <Badge
            size={"lg"}
            icon={icon}
            variant={"outline"}
            className={cn("gap-2 p-0 text-sm border-0 capitalize ", style.text )}
          >
            <span className="text-sm text-muted-foreground font-semibold">
              {Order.status}
            </span>
          </Badge>
        </div>
        <CardDescription className="text-sm font-medium line-clamp-2 leading-4.5">
          {Order.items?.map((item, i) => (
            <span key={i}>
              {item.product?.name} ({item.quantity}x);{" "}
            </span>
          ))}
        </CardDescription>
      </CardHeader>

      <CardContent className="content-center items-center space-y-3 w-full h-full">
        <h3 className="flex w-full justify-between text-muted-foreground text-xs">
          <span>3 Nov, 2:00pm</span>
          <span>9 Nov, 2:00pm</span>
        </h3>

        <div className="relative">
          <div className="z-20 rounded-full absolute size-[10px] top-[-4px] right-0 opacity-60 bg-accent-foreground flex justify-center items-center">
            <div className="top-0 size-1 bg-background rounded-full" />
          </div>

          {/* progress bar warna dinamis */}
          <Progress value={progress} className={cn("w-full h-[3px]", style.progress)} />

          <div className="z-20 rounded-full absolute size-[10px] top-[-4px] left-0 bg-accent-foreground flex justify-center items-center">
            <div className="top-0 size-1 bg-background rounded-full" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between w-full items-center gap-2">
        <div className="flex gap-3 items-center">
          <Badge
            size={"lg"}
            icon={iconShipping}
            variant={"outline"}
            className={cn("bg-background rounded-full py-4.5 " ,
              style.fill
            )}
          >
            <span className="sr-only text-sm text-muted-foreground font-semibold">
              {Order.shipping_method}
            </span>
          </Badge>
          <div>
            <h5 className="text-xs font-semibold capitalize">{Order.shipping_method}</h5>
            <p className="text-[10px]">
              <span className="text-muted-foreground">Via </span>
              <span className="font-semibold text-accent-foreground">Pengiriman</span>
            </p>
          </div>
        </div>
        <Button className="bg-accent-foreground rounded-full" size={"icon"}>
          <ChevronRight />
        </Button>
      </CardFooter>

      {/* warna bar bawah dinamis */}
      <div className={cn("absolute w-full h-3 bottom-0", style.accent)} />
    </Card>
  )
}

export default OrderCard
