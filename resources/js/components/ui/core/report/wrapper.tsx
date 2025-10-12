"use client"
import React from 'react'

import { Button } from '../../fragments/shadcn-ui/button';
import { Download, LucideLoader } from 'lucide-react';
import { CalendarDateRangePicker } from './components/DateRangePicker';


import TabsLink from '../../fragments/custom-ui/Tabs-Link';
import { tabsLinktype } from '@/types';

interface type {
  children?: React.ReactNode
//   input: GetDateRange
  title?: string
}

function Wrapper({ children,  title = "Overviews"}: type) {
  const currentContent = title
//   const { hasActiveFilters, clearFilters } = useDashboardFilters()


//   const [isExporting, setIsExporting] = React.useState(false);

//   const handleExportmess = async () => {
//     try {
//       setIsExporting(true);
      
//       // Show loading toast
//       toast.loading("Exporting report data...", {
//         id: "export-loading"
//       });

//       // Fetch data from server
//       const result = await exportDataReportAction({ input: {
//         ...input
//       }});
      
//       if (!result.success) {
//         toast.error(result.error || "Failed to export data report", {
//           id: "export-loading"
//         });
//         return;
//       }

//       if (!result.data ) {
//         toast.warning("No report data to export", {
//           id: "export-loading"
//         });
//         return;
//       }

//       // Export menggunakan function baru
//       exportDataToExcel(
//         result.data, 
//         `report-data-${new Date().toISOString().split('T')[0]}`
//       );

//       // Success toast
//       toast.success(`Successfully exported report records`, {
//         id: "export-loading"
//       });

//     } catch (error) {
//       console.error('Export error:', error);
//       toast.error("An error occurred while exporting", {
//         id: "export-loading"
//       });
//     } finally {
//       setIsExporting(false);
//     }
//   };


const Tabslink: tabsLinktype[] = [
  { 
   link: `/dashboard`,
     name: 'Overview'
  },

  { 
   link: `/dashboard/analytics`,
     name: 'Analytics'
  },
 
]


  return (
    <div className='flex-1 space-y-4'>
      <header className='flex w-full flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className="flex items-center gap-4">
          <h2 className='text-3xl font-bold tracking-tight'>{currentContent}</h2>
       
        </div>
        <div className='flex flex-wrap items-center gap-2 sr-only'>
             {/* {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground "
            >
              Clear Filters
            </Button>
          )} */}
          <CalendarDateRangePicker />

            <Button className=''>
        
            <Download className="h-4 w-4" />
            <span className="">Export</span>
          
          </Button>
           
        </div>
      </header>

      <main  className='space-y-4'>
     
      {/* <TabsLink  
       Tabslink={Tabslink}
      /> */}
   

       {children}


      </main>
    </div>
  )
}

export default Wrapper