import AppLayout from "@/components/ui/core/layout/app/app-layout";
import OrderCard from "@/components/ui/fragments/custom-ui/card/OrderCard";
import { ApiResponseOrders } from "@/types";

export default function Pages({ ...props} : ApiResponseOrders) {
    console.log(props.data)
    return (
        <AppLayout >

          <div className="flex-1 space-y-4">
         
               <header className="flex flex-col gap-0.5 mb-6">
             <h2 className="text-3xl font-bold tracking-tight">My Orders</h2>
             <p className="text-muted-foreground">Here is your pinjaman list. Manage your Products here.</p>
           </header>
         
           
             <main  className='  gap-5 grid sm:grid-cols-2 lg:grid-cols-3   xl:grid-cols-4 space-y-4'>
         {props.data?.map((item, i) => {
            return(

                <OrderCard key={i} Order={item}/>
            )
         })}
          
             </main>
               </div>
            
        </AppLayout>
    );
}
