export type colorType = keyof typeof cottonCandyCollection['colors'];

const cottonCandyCollection = {
  productId: '00000001',
  name: 'Cotton Candy Collection',
  description:
    '<p>Say hello to your new favorite coords!</p><p>Style it with a pair of white sneakers or simply your best sandals and you can never go wrong with the The Cotton Candy.</p><p>The Top is slightly larger with half sleeves and relaxed bodice for unrestricted movement. The Shorts are high waisted with an elastic band, side pockets and features a little slit at the sides to give you that fresh feeling.</p><p>This set can be worn indoors and outdoors as you chill comfortably.</p>',
  model: '<p>Model wears Small</p><p>Height: 5\'2</p><p>Bust: 32"</p><p>Waist: 25"</p><p>Hip: 32"</p>',
  'care-instructions':
    '<p>60% Linen, 40% Cotton</p><p>Gentle Machine or Hand Wash</p><p>Wash Cold</p><p>Do Not Bleach</p><p>Hang To Dry</p><p>Iron Medium</p>',
  sizes: ['s', 'm', 'l'],
  colors: {
    Cotton: ['cotton-1.jpg', 'cotton-2.jpg', 'cotton-3.jpg', 'cotton-4.jpg'],
    Candy: ['candy-1.jpg', 'candy-2.jpg'],
  },
  variants: [
    { size: 's', color: 'pink', qty: 6, itemId: '00000001' },
    { size: 'm', color: 'pink', qty: 3, itemId: '00000002' },
    { size: 'l', color: 'pink', qty: 11, itemId: '00000003' },
    { size: 's', color: 'beige', qty: 4, itemId: '00000004' },
    { size: 'm', color: 'beige', qty: 8, itemId: '00000005' },
    { size: 'l', color: 'beige', qty: 2, itemId: '00000006' },
  ],
  price: '999.00',
  slug: 'cotton-candy',
};

export default [cottonCandyCollection];
