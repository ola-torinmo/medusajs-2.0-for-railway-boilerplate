/ scripts/test-region.js
const testRegion = async () => {
  const BACKEND = 'http://localhost:9000'
  
  // Test getting regions
  const res = await fetch(`${BACKEND}/store/regions`)
  const data = await res.json()
  
  console.log('All regions:')
  const regions = data.regions || []
  regions.forEach(r => {
    console.log(`- ${r.name} (${r.currency_code}): ${r.id}`)
    if (r.countries) {
      console.log(`  Countries: ${r.countries.map(c => c.iso_2).join(', ')}`)
    }
  })
  
  // Find Nigeria
  const ng = regions.find(r => r.currency_code === 'NGN')
  if (ng) {
    console.log('\n✅ Nigeria region found!')
    console.log('Add to .env.local:')
    console.log(`NEXT_PUBLIC_REGION_ID=${ng.id}`)
  }
}

testRegion()