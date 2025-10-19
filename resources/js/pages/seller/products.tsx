import { ProductDataTable } from '@/components/ui/core/dashboard/table/products/ProductsDataTable'
import AppLayout from '@/components/ui/core/layout/app/app-layout'
import { ProductResponse } from '@/types'


function products(props : ProductResponse) {
  console.log(props.data)
  return (
    <AppLayout>
      <div className="flex-1 space-y-4">

      <header className="flex flex-col gap-0.5 mb-6">
    <h2 className="text-3xl font-bold tracking-tight font-sans">Products Management</h2>
    <p className="text-muted-foreground">Here is your pinjaman list. Manage your Products here.</p>
  </header>

  
    <main  className='   space-y-4'>

  <ProductDataTable  data={props}/>
    </main>
      </div>
      </AppLayout>
  )
}

export default products