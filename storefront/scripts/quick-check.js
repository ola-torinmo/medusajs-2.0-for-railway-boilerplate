// 3. Quick diagnostic script: scripts/quick-check.js
// This is a simpler script to quickly check your setup
// ========================================

const quickCheck = async () => {
  const BACKEND = 'http://localhost:9000'
  
  console.log('🚀 Quick Medusa Check\n')
  
  // 1. Check backend
  try {
    const health = await fetch(`${BACKEND}/health`)
    console.log(`✓ Backend: ${health.ok ? 'Running' : 'Not responding'}`)
  } catch (e) {
    console.log('✗ Backend: Not running')
    return
  }
  
  // 2. Check regions
  try {
    const res = await fetch(`${BACKEND}/store/regions`)
    const data = await res.json()
    const regions = data.regions || data.data || []
    console.log(`✓ Regions: ${regions.length} found`)
    
    if (regions.length > 0) {
      console.log('\nRegion IDs:')
      regions.forEach(r => {
        console.log(`  - ${r.id} (${r.currency_code})`)
      })
    }
  } catch (e) {
    console.log('✗ Regions: Error fetching')
  }
  
  // 3. Check products
  try {
    const res = await fetch(`${BACKEND}/store/products?limit=1`)
    const data = await res.json()
    const products = data.products || data.data || []
    console.log(`✓ Products: ${products.length > 0 ? 'Found' : 'None found'}`)
  } catch (e) {
    console.log('✗ Products: Error fetching')
  }
}

quickCheck()