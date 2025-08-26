// 2. Updated file: scripts/test-product.js
// For Medusa v2.0 API structure
// ========================================

const testProduct = async () => {
  const BACKEND = 'http://localhost:9000'
  
  console.log('🧪 Testing Product Availability')
  console.log('='.repeat(50))
  
  try {
    // Get regions first
    const regRes = await fetch(`${BACKEND}/store/regions`)
    const regData = await regRes.json()
    
    // Handle both v1 and v2 API structures
    const regions = regData.regions || regData.data || []
    
    if (!Array.isArray(regions) || regions.length === 0) {
      console.error('❌ No regions found in your store!')
      console.log('Raw response:', JSON.stringify(regData, null, 2).substring(0, 500))
      console.log('\nYou need to create a region first in Medusa Admin:')
      console.log('http://localhost:7000/a/settings/regions')
      return
    }
    
    // Try to find NGN region
    const ngRegion = regions.find(r => 
      r.currency_code === 'NGN' || 
      r.countries?.some(c => c.iso_2 === 'ng' || c.iso_2 === 'NG')
    )
    const testRegion = ngRegion || regions[0]
    
    console.log(`Using region: ${testRegion.name} (${testRegion.currency_code})`)
    console.log(`Region ID: ${testRegion.id}\n`)
    
    // Get products with full details
    const prodRes = await fetch(`${BACKEND}/store/products?region_id=${testRegion.id}&limit=1`)
    const prodData = await prodRes.json()
    const products = prodData.products || prodData.data || []
    
    if (!Array.isArray(products) || products.length === 0) {
      console.log('❌ No products found for this region!')
      console.log('\nTrying to fetch products without region filter...')
      
      const allProdRes = await fetch(`${BACKEND}/store/products?limit=1`)
      const allProdData = await allProdRes.json()
      const allProducts = allProdData.products || allProdData.data || []
      
      if (allProducts.length > 0) {
        console.log(`Found ${allProducts.length} product(s) without region filter.`)
        console.log('Product needs prices set for region:', testRegion.id)
        
        const product = allProducts[0]
        console.log('\nProduct details:')
        console.log(`  Title: ${product.title}`)
        console.log(`  ID: ${product.id}`)
        console.log(`  Variants: ${product.variants?.length || 0}`)
      } else {
        console.log('No products found at all. Create products in Medusa Admin.')
      }
      return
    }
    
    const product = products[0]
    console.log('📦 Testing Product:', product.title)
    console.log('-'.repeat(50))
    
    // Check all important fields
    console.log('\n✓ Basic Info:')
    console.log(`  ID: ${product.id}`)
    console.log(`  Handle: ${product.handle}`)
    console.log(`  Status: ${product.status}`)
    console.log(`  Description: ${product.description ? 'Yes ✓' : 'No ✗'}`)
    console.log(`  Thumbnail: ${product.thumbnail ? 'Yes ✓' : 'No ✗'}`)
    console.log(`  Images: ${product.images?.length || 0}`)
    
    console.log('\n✓ Variants:')
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v, i) => {
        console.log(`  Variant ${i + 1}:`)
        console.log(`    - ID: ${v.id}`)
        console.log(`    - Title: ${v.title || 'Default'}`)
        console.log(`    - Inventory: ${v.inventory_quantity ?? 'Not tracked'}`)
        console.log(`    - Manage inventory: ${v.manage_inventory}`)
        
        // Check for calculated price (Medusa v2 structure)
        if (v.calculated_price !== undefined) {
          console.log(`    - Calculated price: ${v.calculated_price}`)
        }
        
        if (v.prices && v.prices.length > 0) {
          console.log(`    - Prices set: ${v.prices.length}`)
        } else {
          console.log(`    - ❌ No prices set!`)
        }
      })
    } else {
      console.log('  ❌ No variants found!')
    }
    
    // Test add to cart availability
    console.log('\n✓ Add to Cart Check:')
    const canAddToCart = product.variants?.some(v => 
      (v.inventory_quantity > 0 || !v.manage_inventory) && 
      (v.calculated_price !== undefined || v.prices?.length > 0)
    )
    
    if (canAddToCart) {
      console.log('  ✅ Product can be added to cart')
    } else {
      console.log('  ❌ Product CANNOT be added to cart')
      console.log('  Possible reasons:')
      if (!product.variants || product.variants.length === 0) {
        console.log('    - No variants available')
      }
      if (product.variants?.every(v => v.manage_inventory && v.inventory_quantity <= 0)) {
        console.log('    - Out of stock (inventory is 0)')
      }
      if (product.variants?.every(v => !v.calculated_price && (!v.prices || v.prices.length === 0))) {
        console.log('    - No prices set for this region')
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\nFull error:', error)
  }
}

// Run the test
testProduct()