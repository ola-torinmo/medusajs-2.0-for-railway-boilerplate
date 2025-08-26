// Test if the API returns correct prices
// ========================================

const testFrontendAPI = async () => {
  const BACKEND = 'http://localhost:9000'
  const REGION_ID = 'reg_01K2M34M1CCZHHV18FBKM21YZR' // Your Nigeria region ID
  
  console.log('Testing Frontend API Calls\n')
  
  // Test 1: Get regions
  const regionsRes = await fetch(`${BACKEND}/store/regions`)
  const regionsData = await regionsRes.json()
  console.log('Available regions:', regionsData.regions?.map(r => ({
    id: r.id,
    currency: r.currency_code
  })))
  
  // Test 2: Get product with region
  const productHandle = 'face-base-foundation' // Use actual handle
  const productUrl = `${BACKEND}/store/products?handle=${productHandle}&region_id=${REGION_ID}`
  
  console.log('\nFetching:', productUrl)
  
  const productRes = await fetch(productUrl)
  const productData = await productRes.json()
  const product = productData.products?.[0]
  
  if (product) {
    console.log('\nProduct found:', product.title)
    console.log('Variants:')
    product.variants?.forEach(v => {
      console.log(`  - ${v.title || 'Default'}`)
      console.log(`    Calculated Price: ${v.calculated_price}`)
      console.log(`    Prices: ${JSON.stringify(v.prices)}`)
    })
  } else {
    console.log('Product not found!')
  }
}

// Run with: node scripts/test-frontend-api.js
testFrontendAPI()