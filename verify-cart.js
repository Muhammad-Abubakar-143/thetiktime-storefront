#!/usr/bin/env node
/**
 * Quick verification that the Hostinger cart system is properly integrated
 * Run with: node verify-cart.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Verifying Add-to-Cart Implementation\n');

// Check 1: Hostinger cart library exists
console.log('1️⃣  Checking hostinger-cart.ts exists...');
const cartLibPath = path.join(__dirname, 'lib', 'hostinger-cart.ts');
if (fs.existsSync(cartLibPath)) {
  console.log('   ✅ lib/hostinger-cart.ts found\n');
} else {
  console.log('   ❌ lib/hostinger-cart.ts NOT found\n');
  process.exit(1);
}

// Check 2: Cart hook imports from hostinger
console.log('2️⃣  Checking use-cart.tsx imports hostinger-cart...');
const cartHookPath = path.join(__dirname, 'hooks', 'use-cart.tsx');
const hookContent = fs.readFileSync(cartHookPath, 'utf8');
if (hookContent.includes('from \'@/lib/hostinger-cart\'')) {
  console.log('   ✅ use-cart.tsx imports from hostinger-cart\n');
} else {
  console.log('   ❌ use-cart.tsx does NOT import from hostinger-cart\n');
  process.exit(1);
}

// Check 3: Product card uses new addItem signature
console.log('3️⃣  Checking product-card.tsx uses new addItem signature...');
const cardPath = path.join(__dirname, 'components', 'product-card.tsx');
const cardContent = fs.readFileSync(cardPath, 'utf8');
if (cardContent.includes('hostinger_product_id') && cardContent.includes('addItem(')) {
  console.log('   ✅ product-card.tsx uses Hostinger product IDs\n');
} else {
  console.log('   ⚠️  product-card.tsx might not be using new addItem correctly\n');
}

// Check 4: Product view uses new addItem signature
console.log('4️⃣  Checking product-view.tsx uses new addItem signature...');
const viewPath = path.join(__dirname, 'components', 'product-view.tsx');
const viewContent = fs.readFileSync(viewPath, 'utf8');
if (viewContent.includes('hostinger_product_id') && viewContent.includes('addItem(')) {
  console.log('   ✅ product-view.tsx uses Hostinger product IDs\n');
} else {
  console.log('   ⚠️  product-view.tsx might not be using new addItem correctly\n');
}

// Check 5: Cart drawer updated
console.log('5️⃣  Checking cart-drawer.tsx updated for new cart format...');
const drawerPath = path.join(__dirname, 'components', 'cart', 'cart-drawer.tsx');
const drawerContent = fs.readFileSync(drawerPath, 'utf8');
if (drawerContent.includes('Number(item.product_id)') && drawerContent.includes('Number(item.variant_id)')) {
  console.log('   ✅ cart-drawer.tsx converts IDs to numbers\n');
} else {
  console.log('   ⚠️  cart-drawer.tsx might not handle ID conversion\n');
}

// Check 6: Checkout view updated
console.log('6️⃣  Checking checkout-view.tsx uses new cart format...');
const checkoutPath = path.join(__dirname, 'components', 'checkout-view.tsx');
const checkoutContent = fs.readFileSync(checkoutPath, 'utf8');
if (checkoutContent.includes('product_id') && checkoutContent.includes('variant_id')) {
  console.log('   ✅ checkout-view.tsx uses new cart format\n');
} else {
  console.log('   ⚠️  checkout-view.tsx might not handle new cart format\n');
}

console.log('✨ Verification complete!\n');
console.log('📝 Manual testing required:');
console.log('   1. Navigate to http://localhost:3001');
console.log('   2. Add a product to cart');
console.log('   3. Check that cart opens with the product');
console.log('   4. Verify localStorage has the cart data');
console.log('   5. Test checkout flow\n');
