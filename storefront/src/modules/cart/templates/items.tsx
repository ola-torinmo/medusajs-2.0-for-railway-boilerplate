// import repeat from "@lib/util/repeat"
// import { HttpTypes } from "@medusajs/types"
// import { Heading, Table } from "@medusajs/ui"

// import Item from "@modules/cart/components/item"
// import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

// type ItemsTemplateProps = {
//   items?: HttpTypes.StoreCartLineItem[]
// }

// const ItemsTemplate = ({ items }: ItemsTemplateProps) => {
//   return (
//     <div >
//       <div className="pb-3 flex items-center">
//         <Heading className="text-[2rem] leading-[2.75rem]"><h1>Cart</h1></Heading>
//       </div>
//       <Table >
//         <Table.Header className="border-t-0">
//           <Table.Row className="text-ui-fg-subtle txt-medium-plus bg-[#F9F5F2]">
//             <Table.HeaderCell className="!pl-0 "><h2>Item</h2></Table.HeaderCell>
//             <Table.HeaderCell></Table.HeaderCell>
//             <Table.HeaderCell><h2>Quantity</h2></Table.HeaderCell>
//             <Table.HeaderCell className="hidden small:table-cell">
//               <h2>Price</h2>
//             </Table.HeaderCell>
//             <Table.HeaderCell className=" text-right">
//              <h2>Total</h2> 
//             </Table.HeaderCell>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body className="bg-[#F9F5F2]" >
//           {items
//             ? items
//                 .sort((a, b) => {
//                   return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
//                 })
//                 .map((item) => {
//                   return <Item key={item.id} item={item} />
//                 })
//             : repeat(5).map((i) => {
//                 return <SkeletonLineItem key={i} />
//               })}
//         </Table.Body>
//       </Table>
//     </div>
//   )
// }

// export default ItemsTemplate

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
}

const ItemsTemplate = ({ items }: ItemsTemplateProps) => {
  return (
    <div>
       <div className="pb-3 flex items-center">
         <Heading className="text-[2rem] leading-[2.75rem]"><h1>Cart</h1></Heading>
       </div>
      
      {/* Horizontally scrollable wrapper */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <Table className="w-full" style={{ minWidth: '500px' }}>
          <Table.Header className="border-t-0">
            <Table.Row className="text-ui-fg-subtle txt-medium-plus bg-[#F9F5F2]">
              <Table.HeaderCell className="!pl-0 py-1 sm:py-3">
                <h2 className="text-xs sm:text-base">Item</h2>
              </Table.HeaderCell>
              <Table.HeaderCell className="py-1 sm:py-3"></Table.HeaderCell>
              <Table.HeaderCell className="py-1 sm:py-3">
                <h2 className="text-xs sm:text-base">Quantity</h2>
              </Table.HeaderCell>
              <Table.HeaderCell className="hidden small:table-cell py-1 sm:py-3">
                <h2 className="text-xs sm:text-base">Price</h2>
              </Table.HeaderCell>
              <Table.HeaderCell className="text-right py-1 sm:py-3">
                <h2 className="text-xs sm:text-base">Total</h2>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="bg-[#F9F5F2]">
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return <Item key={item.id} item={item} />
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default ItemsTemplate