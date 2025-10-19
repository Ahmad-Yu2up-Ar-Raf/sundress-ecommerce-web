import Checkout from '@/components/ui/fragments/custom-ui/block/checkout-block'
import { CheckoutResponse } from '@/types'




function index({ data }: CheckoutResponse) {
  console.log(data)
  return (
  <Checkout  data={data}/>
  )
}

export default index