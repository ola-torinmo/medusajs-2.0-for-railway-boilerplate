// import ItemsTemplate from "./items"
// import Summary from "./summary"
// import EmptyCartMessage from "../components/empty-cart-message"
// import SignInPrompt from "../components/sign-in-prompt"
// import Divider from "@modules/common/components/divider"
// import { HttpTypes } from "@medusajs/types"

// const CartTemplate = ({
//   cart,
//   customer,
// }: {
//   cart: HttpTypes.StoreCart | null
//   customer: HttpTypes.StoreCustomer | null
// }) => {
//   return (
//     <div className="py-12 bg-[#F9F5F2]">
//       <div className="content-container" data-testid="cart-container">
//         {cart?.items?.length ? (
//           <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-x-6 lg:gap-x-20">
//             <div className="flex flex-col py-6 gap-y-6">
//               {!customer && (
//                 <>
//                   <SignInPrompt />
//                   <Divider />
//                 </>
//               )}
//               <ItemsTemplate items={cart?.items} />
//             </div>
//             <div className="relative bg-[#F9F5F2] mt-6 lg:mt-0">
//               <div className="flex flex-col gap-y-8 lg:sticky lg:top-12">
//                 {cart && cart.region && (
//                   <>
//                     <div className="py-6">
//                       <Summary cart={cart as any} />
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <EmptyCartMessage />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CartTemplate

import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-6 bg-[#F9F5F2]">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-x-4 lg:gap-x-20 gap-y-4">
            <div className="flex flex-col py-2 gap-y-3 min-w-0">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate items={cart?.items} />
            </div>
            <div className="relative bg-[#F9F5F2]">
              <div className="flex flex-col gap-y-4 lg:sticky lg:top-12">
                {cart && cart.region && (
                  <>
                    <div className="py-3">
                      <Summary cart={cart as any} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate