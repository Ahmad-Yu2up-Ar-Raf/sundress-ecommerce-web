"use client"

import { ChartPieIcon, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/fragments/shadcn-ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/fragments/shadcn-ui/chart"
import React from "react"
import { cn } from "@/lib/utils"
import { chartConfig } from "@/config/chart/pie-chart"
// import { EmployeeData } from "@/types"
import { useIsMobile } from "@/hooks/use-mobile"



interface ChartPieProps {
  data?: Record<string, number>;
  title?: string;
  description?: string;
  nameKey?: string;
  className?: string;
  showFooter? : boolean
  footerTitle?: string;
  footerDeskripcion?: string
  
}


export function ChartPie({ 
  data = {},
  footerTitle  ,
  footerDeskripcion ,
  showFooter = true,

  nameKey = "Employee",
  title = "Employee Distribution - Role",
  description = "Current employee count by role",
  className
}: ChartPieProps) {
  

const isMobile = useIsMobile()

  const totalEmployees = React.useMemo(() => {
    return Object.values(data).reduce((acc, curr) => acc + curr, 0);
  }, [data]);




const showFoooter = isMobile ? true : showFooter

  // Transform data ke format yang dibutuhkan recharts
  const chartData = React.useMemo(() => {
    return Object.entries(data)
      .filter(([_, count]) => count > 0) 
      .map(([name, count]) => ({
        name,
        count,
        fill: `var(--color-${name})`,
       percentage: totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(1) : '0',
        label: chartConfig[name as keyof typeof chartConfig]?.label || name
      }))
      .sort((a, b) => b.count - a.count);
      ;

  }, [data]);




const highest = chartData[0]


  if (totalEmployees === 0) {
    return (
      <Card className={cn("flex flex-col w-full gap-2 ",    className)}>
      <CardHeader className=" space-y-0 border-b py-1 ">
        <CardTitle className=" line-clamp-1">{title}</CardTitle>
        <CardDescription className=" line-clamp-1">{description}</CardDescription>
      </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[40dvh]">
          <div className="text-center text-muted-foreground">
            <ChartPieIcon className="  size-6 m-auto mb-5 "/>
            <p className="text-lg font-medium">No {nameKey} found</p>
            <p className="text-sm">Add {nameKey} to see the distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("flex flex-col w-full", className)}>
    <CardHeader className=" space-y-0 border-b py-1 ">
        <CardTitle className=" line-clamp-1">{title}</CardTitle>
        <CardDescription className=" line-clamp-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="  w-full pb-0 h-full  content-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square my-auto max-h-[35dvh]"
        >
          <PieChart
           
              margin={{
        
              top:10
            }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                hideLabel 
     
              />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              strokeWidth={5}
           
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
              label={false}
            />
            {/* Alternative approach untuk center label */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground ">
              <tspan x="50%" dy="-0.5em" className="text-3xl font-bold">
                {totalEmployees.toLocaleString()}
              </tspan>
              <tspan x="50%" dy="1.5em" className="text-sm fill-muted-foreground">
                {nameKey}
              </tspan>
            </text>
            <ChartLegend
     
           
             formatter={(value) => (
                  <span className="capitalize ">
                    {chartConfig[value as keyof typeof chartConfig]?.label || value}
                  </span>
                )}
              content={<ChartLegendContent 
                className=" "
                nameKey="name"
               payload={chartData.map(item => ({
                  value: item.name,
                  color: item.fill,}  ))}   
              />}
              className=" flex-wrap gap-x-4   gap-y-2   *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
        <CardFooter className={cn("flex-col gap-2 text-sm" , !showFoooter && "sr-only")}>
        <h3 className="flex  items-center gap-2 leading-none font-medium">
          {footerTitle ? footerTitle :  `${highest.percentage}% your ${nameKey} is ${highest.label}`} <TrendingUp className="h-4 w-4" />
        </h3>
        <p className="text-muted-foreground line-clamp-1 leading-none">
          {footerDeskripcion ? footerDeskripcion : `Showing total ${nameKey}`}
        </p>
      </CardFooter>
    </Card>
  )
}