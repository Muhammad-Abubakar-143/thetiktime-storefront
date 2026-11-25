#!/usr/bin/env node
/**
 * Test the order API endpoint
 */

async function testOrderAPI() {
  if (process.env.CONFIRM_LIVE_ORDER !== '1') {
    console.error(
      'This sends a live order. Set CONFIRM_LIVE_ORDER=1 only when you intend to create one.'
    );
    process.exitCode = 1;
    return;
  }

  const payload = {
    customer_name: 'Test User',
    phone: '03001234567',
    email: 'test@example.com',
    address: 'Test Street',
    city: 'Lahore',
    notes: 'Test order',
    items: [
      { product_id: 16, variant_id: 32, quantity: 1 }
    ]
  };

  try {
    console.log('Testing /api/order endpoint...\n');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('\nSending request...\n');

    const response = await fetch('http://localhost:3000/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response Status:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('Response Body (raw):', responseText.substring(0, 500));
    
    try {
      const json = JSON.parse(responseText);
      console.log('\nParsed Response:', JSON.stringify(json, null, 2));
      
      if (json.order_number || json.order_id) {
        console.log('\n✅ SUCCESS! Order created:', json.order_number || json.order_id);
      } else if (json.error) {
        console.log('\n❌ ERROR:', json.error);
        if (json.details) {
          console.log('Details:', json.details);
        }
      }
    } catch (e) {
      console.log('\n⚠️  Could not parse response as JSON');
      console.log('Response likely HTML or plain text');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testOrderAPI();
