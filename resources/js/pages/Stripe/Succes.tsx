import SuccessCardPayment from '@/components/ui/fragments/custom-ui/card/succes-payment-card'
import { Order } from '@/types'
import React from 'react'

function Succes({ orders }: { orders: Order[]}) {
    console.log(orders)
  return (
    <section className='  min-h-dvh content-center items-center'>

      <SuccessCardPayment order={orders} />
    </section>
  )
}

export default Succes
