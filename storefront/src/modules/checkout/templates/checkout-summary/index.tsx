import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 bg-[#F9F5F2]">
      <div className="w-full bg-[#F9F5F2] flex flex-col ">
        <Divider className="my-6 small:hidden " />
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular items-baseline "
        >
          <h1>In your Cart </h1>
        </Heading>
        <Divider className="my-6 " />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate items={cart?.items} />
        <div className="my-6 bg-[#F9F5F2]">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
