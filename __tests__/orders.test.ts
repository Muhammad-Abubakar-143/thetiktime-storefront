import { buildOrderPayload, type OrderInput } from '@/lib/orders';

describe('Order API Integration', () => {
  describe('buildOrderPayload', () => {
    it('should build a valid order payload from checkout input', () => {
      const input: OrderInput = {
        customer_name: 'John Doe',
        phone: '03001234567',
        email: 'john@example.com',
        address_1: 'House 1',
        address_2: 'Street 2',
        city: 'Lahore',
        province: 'Punjab',
        postal_code: '54000',
        notes: 'Call before delivery',
        items: [
          { product_id: 1, variant_id: 11, quantity: 1 },
          { product_id: 2, variant_id: 22, quantity: 2 },
        ],
      };

      const payload = buildOrderPayload(input);

      expect(payload).toEqual({
        customer_name: 'John Doe',
        phone: '03001234567',
        email: 'john@example.com',
        address: 'House 1, Street 2, Punjab, 54000',
        city: 'Lahore',
        notes: 'Call before delivery',
        items: [
          { product_id: 1, variant_id: 11, quantity: 1 },
          { product_id: 2, variant_id: 22, quantity: 2 },
        ],
      });
    });

    it('should handle optional fields gracefully', () => {
      const input: OrderInput = {
        customer_name: 'Jane Smith',
        phone: '03009876543',
        email: 'jane@example.com',
        address_1: 'Apartment 5',
        city: 'Karachi',
        items: [{ product_id: 16, variant_id: 32, quantity: 1 }],
      };

      const payload = buildOrderPayload(input);

      expect(payload).toEqual({
        customer_name: 'Jane Smith',
        phone: '03009876543',
        email: 'jane@example.com',
        address: 'Apartment 5',
        city: 'Karachi',
        notes: '',
        items: [{ product_id: 16, variant_id: 32, quantity: 1 }],
      });
    });

    it('should filter out undefined address parts', () => {
      const input: OrderInput = {
        customer_name: 'Ali Khan',
        phone: '03005551234',
        email: 'ali@example.com',
        address_1: 'Main Road',
        city: 'Islamabad',
        notes: 'Evening delivery preferred',
        items: [{ product_id: 5, variant_id: 50, quantity: 3 }],
      };

      const payload = buildOrderPayload(input);

      expect(payload.address).toBe('Main Road');
      expect(payload.notes).toBe('Evening delivery preferred');
    });

    it('should include all required fields in payload', () => {
      const input: OrderInput = {
        customer_name: 'Test User',
        phone: '1234567890',
        email: 'test@example.com',
        address_1: 'Test Address',
        city: 'Test City',
        items: [],
      };

      const payload = buildOrderPayload(input);

      expect(payload).toHaveProperty('customer_name');
      expect(payload).toHaveProperty('phone');
      expect(payload).toHaveProperty('email');
      expect(payload).toHaveProperty('address');
      expect(payload).toHaveProperty('city');
      expect(payload).toHaveProperty('notes');
      expect(payload).toHaveProperty('items');
    });

    it('should map checkout form fields correctly', () => {
      const checkoutInput: OrderInput = {
        customer_name: 'Muhammad Hassan',
        phone: '0333-1234567',
        email: 'hassan@example.com',
        address_1: 'House #42',
        address_2: 'Block C, Defence',
        city: 'Lahore',
        province: 'Punjab',
        postal_code: '54000',
        notes: 'Please use main gate entrance',
        items: [
          { product_id: 16, variant_id: 32, quantity: 1 },
          { product_id: 15, variant_id: 31, quantity: 1 },
        ],
      };

      const payload = buildOrderPayload(checkoutInput);

      expect(payload.customer_name).toBe('Muhammad Hassan');
      expect(payload.phone).toBe('0333-1234567');
      expect(payload.email).toBe('hassan@example.com');
      expect(payload.city).toBe('Lahore');
      expect(payload.notes).toBe('Please use main gate entrance');
      expect(payload.items).toHaveLength(2);
      expect(payload.items[0].product_id).toBe(16);
      expect(payload.items[1].product_id).toBe(15);
    });
  });

  describe('Order payload structure', () => {
    it('should match Hostinger API expectations', () => {
      const input: OrderInput = {
        customer_name: 'Test Customer',
        phone: '123456789',
        email: 'customer@test.com',
        address_1: 'Test Address',
        city: 'Test City',
        items: [{ product_id: 1, variant_id: 11, quantity: 1 }],
      };

      const payload = buildOrderPayload(input);

      // Verify payload matches expected Hostinger API schema
      expect(typeof payload.customer_name).toBe('string');
      expect(typeof payload.phone).toBe('string');
      expect(typeof payload.email).toBe('string');
      expect(typeof payload.address).toBe('string');
      expect(typeof payload.city).toBe('string');
      expect(typeof payload.notes).toBe('string');
      expect(Array.isArray(payload.items)).toBe(true);

      payload.items.forEach((item) => {
        expect(typeof item.product_id).toBe('number');
        expect(typeof item.variant_id).toBe('number');
        expect(typeof item.quantity).toBe('number');
      });
    });
  });
});
