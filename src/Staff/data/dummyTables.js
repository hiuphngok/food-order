// src/data/dummyTables.js

export const tables = [
  {
    id: 'B01',
    status: 'ordered',
    image: 'https://via.placeholder.com/60',
    orders: [
      { name: 'Lẩu bò', image: 'https://via.placeholder.com/120', status: 'waiting' },
      { name: 'Rau sống', image: 'https://via.placeholder.com/120', status: 'served' },
    ],
  },
  {
    id: 'B02',
    status: 'pending',
    image: 'https://via.placeholder.com/60',
    orders: [],
  },
  {
    id: 'B03',
    status: 'cooking',
    image: 'https://via.placeholder.com/60',
    orders: [
      { name: 'Tôm hấp', image: 'https://via.placeholder.com/120', status: 'cooking' },
    ],
  },
  {
    id: 'B04',
    status: 'ordered',
    image: 'https://via.placeholder.com/60',
    orders: [
      { name: 'Gà nướng', image: 'https://via.placeholder.com/120', status: 'waiting' },
      { name: 'Nước suối', image: 'https://via.placeholder.com/120', status: 'served' },
    ],
  },
  {
    id: 'B05',
    status: 'pending',
    image: 'https://via.placeholder.com/60',
    orders: [],
  }
];

