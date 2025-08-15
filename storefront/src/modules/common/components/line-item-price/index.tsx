import { clx } from "@medusajs/ui"

import { getPercentageDiff } from "@lib/util/get-precentage-diff"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
}

const LineItemPrice = ({ item, style = "default" }: LineItemPriceProps) => {
  // Get the normalized price object (may be null)
  const priceObj = getPricesForVariant(item.variant)

  // Provide safe defaults
  const currency_code: string = priceObj?.currency_code ?? process.env.NEXT_PUBLIC_CURRENCY_CODE?.toUpperCase() ?? "NGN"
  const calculated_price_number: number = priceObj?.calculated_price_number ?? 0
  // If original_price_number missing, fall back to calculated (so comparisons work)
  const original_price_number: number = priceObj?.original_price_number ?? calculated_price_number

  // Sum adjustments (defensive)
  const adjustmentsSum: number = (item.adjustments || []).reduce((acc: number, adjustment: any) => {
    const amt = typeof adjustment?.amount === "number" ? adjustment.amount : Number(adjustment?.amount) || 0
    return acc + amt
  }, 0)

  // Quantities should exist on both cart and order line items
  const qty = typeof item.quantity === "number" ? item.quantity : Number(item.quantity) || 1

  const originalPrice = original_price_number * qty
  const currentPrice = calculated_price_number * qty - adjustmentsSum
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
      <div className="text-left">
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="text-ui-fg-subtle">Original: </span>
              )}
              <span
                className="line-through text-ui-fg-muted"
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice,
                  currency_code, // always a string now
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="text-ui-fg-interactive">
                -{getPercentageDiff(originalPrice, currentPrice || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className={clx("text-base-regular", {
            "text-ui-fg-interactive": hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: currentPrice,
            currency_code, // always a string now
          })}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
