const fs = require('fs');

const raw = fs.readFileSync('./database.json', 'utf8');
const db = JSON.parse(raw);

function fixIdList(list) {
  return list.map(item => ({
    ...item,
    id: item.id != null ? Number(item.id) : item.id
  }));
}

db.tables = fixIdList(db.tables || []);
db.categories = fixIdList(db.categories || []);
db.roles = fixIdList(db.roles || []);
db.users = fixIdList(db.users || []);
db.orders = db.orders?.map(order => ({
  ...order,
  id: order.id != null ? Number(order.id) : order.id,
  tableId: order.tableId != null ? Number(order.tableId) : order.tableId
})) || [];

db.menu = db.menu?.map(item => ({
  ...item,
  id: item.id != null ? Number(item.id) : item.id,
  price: Number(item.price),
  serveTime: Number(item.serveTime),
  categoryId: Number(item.categoryId)
})) || [];

// Ghi đè lại file
fs.writeFileSync('./database.json', JSON.stringify(db, null, 2), 'utf8');
console.log('DONE');
