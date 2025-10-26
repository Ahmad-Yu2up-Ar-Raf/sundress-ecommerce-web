import Checkout from '@/components/ui/fragments/custom-ui/block/checkout-block'
import { CheckoutResponse } from '@/types'




function index({ ...props}: CheckoutResponse) {
  console.log(props)
  return (
  <Checkout  data={props.data}/>
  )
}

export default index