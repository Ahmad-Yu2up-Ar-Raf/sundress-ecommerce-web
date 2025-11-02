import { ProductsSchema } from '@/lib/validations/index.t'
import { Head } from '@inertiajs/react'
import { Vendor } from '@/types'
import { ProductDetailPage } from '@/components/ui/core/block/pages/product-detail-page'
import Providers from '@/components/ui/core/layout/provider'
import ProductsCarousel from '@/components/ui/core/block/sections/SectionCarosul'

function Pages({ ...props }: { productSimillar : ProductsSchema[] ,product: ProductsSchema & {
  vendor : Vendor
} }) {
  const product = props.product
  console.log(props.productSimillar)
  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <>
    <Head title={`${product.name} - Details`} />
    <Providers>

      <ProductDetailPage product={product}/>
        <ProductsCarousel label='Bought!' title='Customers also '   loading={false} data={props.productSimillar} />
    </Providers>
    </>
  )
}

export default Pages
