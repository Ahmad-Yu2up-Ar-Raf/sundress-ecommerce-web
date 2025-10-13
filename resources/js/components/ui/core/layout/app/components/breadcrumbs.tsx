import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/fragments/shadcn-ui/breadcrumb';

import { usePage } from '@inertiajs/react';
import React  from 'react';

export function Breadcrumbs() {
  const paths = usePage().url
  const pathNamesFilter = paths.split('?').filter(path => path)



  const pathNames = pathNamesFilter[0].split('/').filter(path => path)

    return (
        <>
          <Breadcrumb className="inline-flex">
              <BreadcrumbList>
       
              
            {
                pathNames.map( (link, index) => { 
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`
              const isLast = pathNames.length === index + 1
                   const itemLink = link[0].toUpperCase() + link.slice(1, link.length)
                   
                    return (
                        <React.Fragment key={index}>
                          <BreadcrumbItem>
       {isLast ?   (
        <BreadcrumbPage>{itemLink}</BreadcrumbPage>
      ) :  
        (
        <BreadcrumbLink href={href} text={itemLink}/>
                 
                  
                ) }
                   
                  
   
                
               
                </BreadcrumbItem>
                            {!isLast &&        <BreadcrumbSeparator className="block" />}
                        </React.Fragment>
                    )
                })
            }
               
              </BreadcrumbList>
            </Breadcrumb>
        </>
    );
}