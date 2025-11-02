import { TooltipProvider } from '@/components/ui/fragments/custom-ui/animate-ui/base/tooltip'
import Checkout from '@/components/ui/core/block/pages/checkout-block'
import { CheckoutResponse } from '@/types'




function index({ ...props}: CheckoutResponse) {
  console.log(props.data)
  return (           
 
          <TooltipProvider>

            <Checkout  data={props.data}/>
  </TooltipProvider>
  )
}

export default index