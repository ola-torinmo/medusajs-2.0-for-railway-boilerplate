// 1. Updated file: scripts/check-medusa-setup.js
// For Medusa v2.0 API structure
// ========================================

const checkMedusaSetup = async () => {
  // Use your backend URL
  const BACKEND_URL = 'http://localhost:9000'
  
  console.log('🔍 Checking Medusa backend at:', BACKEND_URL)
  console.log('=' .repeat(50))
  
  try {
    // Check if backend is running
    const healthRes = await fetch(`${BACKEND_URL}/health`)
    if (!healthRes.ok) {
      console.error('❌ Backend is not responding! Make sure Medusa is running.')
      return
    }
    console.log('✅ Backend is running\n')
    
    // Check regions - Medusa v2.0 structure
    const regionsRes = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const regionsData = await regionsRes.json()
    console.log('Raw regions response:', JSON.stringify(regionsData, null, 2).substring(0, 500))
    
    // Handle both v1 and v2 API structures
    const regions = regionsData.regions || regionsData.data || []
    
    if (!Array.isArray(regions)) {
      console.log('❌ Unexpected regions format. Raw response:')
      console.log(JSON.stringify(regionsData, null, 2))
      return
    }
    
    if (regions.length === 0) {
      console.log('❌ No regions found!')
      console.log('You need to create a region in Medusa Admin first.')
      console.log('Go to: http://localhost:7000/a/settings/regions')
      return
    }
    
    console.log('📍 AVAILABLE REGIONS:')
    console.log('-'.repeat(50))
    regions.forEach((region, index) => {
      console.log(`\nRegion ${index + 1}:`)
      console.log(`  ID: ${region.id} <-- Use this in your .env.local`)
      console.log(`  Name: ${region.name}`)
      console.log(`  Currency: ${region.currency_code}`)
      console.log(`  Tax Rate: ${region.tax_rate}%`)
      if (region.countries && region.countries.length > 0) {
        console.log(`  Countries: ${region.countries.map(c => 
          `${c.display_name || c.name} (${c.iso_2})`
        ).join(', ')}`)
      }
    })
    
    // Find Nigerian region
    const ngRegion = regions.find(r => 
      r.currency_code === 'NGN' || 
      r.countries?.some(c => c.iso_2 === 'ng' || c.iso_2 === 'NG')
    )
    
    if (ngRegion) {
      console.log('\n✅ Found Nigerian Region!')
      console.log('Add this to your .env.local:')
      console.log(`NEXT_PUBLIC_REGION_ID=${ngRegion.id}`)
    } else {
      console.log('\n⚠️  No Nigerian region found. You may need to create one in Medusa Admin.')
      console.log('Using first available region for testing...')
    }
    
    // Check products
    console.log('\n📦 CHECKING PRODUCTS:')
    console.log('-'.repeat(50))
    
    const regionId = ngRegion?.id || regions[0]?.id
    if (regionId) {
      const productsRes = await fetch(
        `${BACKEND_URL}/store/products?region_id=${regionId}&limit=5`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
          }
        }
      )
      
      const productsData = await productsRes.json()
      const products = productsData.products || productsData.data || []
      
      if (!Array.isArray(products)) {
        console.log('Products response format:', JSON.stringify(productsData, null, 2).substring(0, 500))
        return
      }
      
      console.log(`Found ${products.length} products in region ${regionId}\n`)
      
      if (products.length === 0) {
        console.log('⚠️  No products found. Make sure you have:')
        console.log('   1. Created products in Medusa Admin')
        console.log('   2. Set prices for your region')
        console.log('   3. Published the products')
        
        // Try fetching without region to see if products exist at all
        const allProductsRes = await fetch(`${BACKEND_URL}/store/products?limit=5`)
        const allProductsData = await allProductsRes.json()
        const allProducts = allProductsData.products || allProductsData.data || []
        
        if (allProducts.length > 0) {
          console.log(`\n⚠️  Found ${allProducts.length} products without region filter.`)
          console.log('This means products exist but may not have prices for your region.')
        }
      } else {
        products.forEach((product, index) => {
          console.log(`Product ${index + 1}: ${product.title}`)
          console.log(`  ID: ${product.id}`)
          console.log(`  Handle: ${product.handle}`)
          console.log(`  Status: ${product.status}`)
          console.log(`  Variants: ${product.variants?.length || 0}`)
          
          if (product.variants?.[0]) {
            const variant = product.variants[0]
            console.log(`  First Variant:`)
            console.log(`    - Title: ${variant.title || 'Default'}`)
            console.log(`    - SKU: ${variant.sku || 'N/A'}`)
            console.log(`    - Inventory: ${variant.inventory_quantity || 'Not tracked'}`)
            console.log(`    - Prices: ${variant.prices?.length || 0} price(s) set`)
            
            if (variant.calculated_price !== undefined) {
              console.log(`    - Calculated Price: ${variant.calculated_price}`)
            }
          }
          console.log('')
        })
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking Medusa setup:', error.message)
    console.log('\nFull error:', error)
    console.log('\nMake sure:')
    console.log('1. Your Medusa backend is running (npm run dev in backend folder)')
    console.log('2. The backend URL is correct:', BACKEND_URL)
    console.log('3. You have created at least one region in Medusa Admin')
  }
}

// Run the check
checkMedusaSetup()