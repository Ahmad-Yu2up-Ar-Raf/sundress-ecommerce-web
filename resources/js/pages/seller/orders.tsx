import { OrderDataTable } from '@/components/ui/core/dashboard/table/orderItems/OrderItemsDataTable'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { ApiResponseOrderItems } from '@/types'
import React from 'react'

function orders({ ...props }: ApiResponseOrderItems) {
  console.log(props.data)
  return (
<AppLayout>
      <div className="flex-1 space-y-4">

      <header className="flex flex-col gap-0.5 mb-6">
    <h2 className="text-3xl font-bold tracking-tight ">Orders Management</h2>
    <p className="text-muted-foreground">Here is your pinjaman list. Manage your Orders here.</p>
  </header>

  
    <main  className='   space-y-4'>

  <OrderDataTable  data={props}/>
    </main>
      </div>
      </AppLayout>
  )
}

export default orders
