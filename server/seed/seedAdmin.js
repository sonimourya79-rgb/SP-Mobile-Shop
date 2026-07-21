require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const SecondhandPhone = require('../models/SecondhandPhone');
const RepairRequest = require('../models/RepairRequest');
const SellRequest = require('../models/SellRequest');
const Order = require('../models/Order');
const ContactMessage = require('../models/ContactMessage');
const { attachProductImages, attachPhoneImages } = require('./imageGen');

const DEMO_CUSTOMER = {
  name: 'Rahul Sharma',
  email: 'customer@spmobile.test',
  password: 'Customer@123',
  phone: '9876543210',
};

const sampleProducts = [
  {
    name: 'Edge-to-Edge Tempered Glass (9H Hardness)',
    category: 'Tempered Glass',
    price: 149,
    stock: 60,
    description: '9H hardness tempered glass with oleophobic coating, anti-fingerprint and bubble-free installation. Fits most models — mention your phone model when ordering.',
  },
  {
    name: 'Privacy Tempered Glass (Anti-Spy)',
    category: 'Tempered Glass',
    price: 249,
    stock: 30,
    description: 'Anti-spy tempered glass that blacks out the screen from side angles — keeps your screen private in public.',
  },
  {
    name: 'Camera Lens Tempered Glass Protector',
    category: 'Tempered Glass',
    price: 99,
    stock: 50,
    description: 'Scratch-proof tempered glass protector for the rear camera module, keeps photos sharp and lens scratch-free.',
  },
  {
    name: 'Shockproof Silicone Back Cover',
    category: 'Back Cover',
    price: 199,
    stock: 45,
    description: 'Soft-touch silicone back cover with raised bezels for camera and screen protection. Available in multiple colors.',
  },
  {
    name: 'Transparent Hard Back Case',
    category: 'Back Cover',
    price: 179,
    stock: 40,
    description: 'Crystal-clear hard case that shows off your phone\'s original design while protecting against scratches.',
  },
  {
    name: 'Matte Finish Back Cover',
    category: 'Back Cover',
    price: 229,
    stock: 32,
    description: 'Fingerprint-resistant matte finish back cover with a premium soft-grip texture.',
  },
  {
    name: '20W PD Fast Charger (Type-C)',
    category: 'Charger',
    price: 399,
    stock: 30,
    description: 'Compact 20W USB Power Delivery wall charger. Fast-charges compatible phones up to 50% in ~30 minutes.',
  },
  {
    name: '33W Dual-Port Fast Charger',
    category: 'Charger',
    price: 549,
    stock: 20,
    description: 'Dual USB-A + Type-C output, supports fast charging for two devices simultaneously.',
  },
  {
    name: '65W GaN Multi-Port Charger',
    category: 'Charger',
    price: 1199,
    stock: 10,
    description: 'Compact GaN charger with 2 Type-C + 1 USB-A ports — powerful enough for laptops and phones together.',
  },
  {
    name: 'Type-C to Type-C Braided Cable (1m)',
    category: 'Charging Cable',
    price: 149,
    stock: 55,
    description: '1-meter nylon braided cable rated for 60W fast charging and data transfer. Tangle-resistant and durable.',
  },
  {
    name: 'USB-A to Lightning Cable (1m)',
    category: 'Charging Cable',
    price: 199,
    stock: 35,
    description: 'MFi-compatible charging and sync cable for iPhone and iPad.',
  },
  {
    name: 'Type-C to Type-C Fast Cable (2m)',
    category: 'Charging Cable',
    price: 229,
    stock: 28,
    description: 'Extra-long 2-meter cable rated for 60W fast charging — reach the charger from bed or sofa.',
  },
  {
    name: '10000mAh Power Bank',
    category: 'Power Bank',
    price: 999,
    stock: 14,
    description: 'Slim 10000mAh power bank with dual output ports and fast-charging support for on-the-go charging.',
  },
  {
    name: '20000mAh Power Bank (Fast Charging)',
    category: 'Power Bank',
    price: 1699,
    stock: 9,
    description: 'High-capacity 20000mAh power bank with 22.5W fast charging — enough for multiple full charges on a trip.',
  },
  {
    name: 'Original-Spec Replacement Battery',
    category: 'Battery',
    price: 649,
    stock: 15,
    description: 'High-capacity replacement battery built to original specifications. Comes with 6-month service warranty when fitted by us.',
  },
  {
    name: 'High-Capacity Battery (5000mAh)',
    category: 'Battery',
    price: 849,
    stock: 10,
    description: 'Extended-capacity 5000mAh replacement battery for models with heavy daily usage — more backup per charge.',
  },
  {
    name: 'In-Ear Wired Earphones with Mic',
    category: 'Wired Earphones',
    price: 249,
    stock: 40,
    description: 'Balanced bass wired earphones with in-line mic and call/volume controls.',
  },
  {
    name: 'Type-C Wired Earphones with Mic',
    category: 'Wired Earphones',
    price: 279,
    stock: 30,
    description: 'Digital Type-C wired earphones for phones without a 3.5mm jack, with in-line mic and volume controls.',
  },
  {
    name: 'Sports Neckband Bluetooth Earphones',
    category: 'Neckband Bluetooth',
    price: 599,
    stock: 22,
    description: 'Sweat-resistant magnetic neckband earphones with up to 12 hours of playback and fast charging.',
  },
  {
    name: 'Premium Neckband with ENC Mic',
    category: 'Neckband Bluetooth',
    price: 899,
    stock: 16,
    description: 'Environmental Noise Cancellation mic neckband for clearer calls, with deep bass drivers and 18-hour battery.',
  },
  {
    name: 'Bluetooth 5.0 Wireless Earbuds',
    category: 'Bluetooth Earbuds',
    price: 899,
    stock: 18,
    description: 'True wireless earbuds with charging case, touch controls, and up to 20 hours combined battery life.',
  },
  {
    name: 'Budget TWS Earbuds',
    category: 'Bluetooth Earbuds',
    price: 599,
    stock: 25,
    description: 'Affordable true wireless earbuds with punchy bass and a compact charging case — great value for daily use.',
  },
  {
    name: 'Portable Mini Bluetooth Speaker',
    category: 'Bluetooth Speaker',
    price: 699,
    stock: 12,
    description: 'Compact speaker with rich sound, 6-hour playback, and built-in mic for hands-free calls.',
  },
  {
    name: 'Bass Boost Bluetooth Speaker (Large)',
    category: 'Bluetooth Speaker',
    price: 1299,
    stock: 8,
    description: 'Larger party speaker with deep bass, 12-hour battery, and IPX5 splash resistance.',
  },
  {
    name: 'Mobile Stand / Holder (Adjustable)',
    category: 'Mobile Holder',
    price: 129,
    stock: 25,
    description: 'Foldable, adjustable desktop mobile stand — great for video calls and watching videos hands-free.',
  },
  {
    name: 'Car Mobile Holder (Dashboard Mount)',
    category: 'Mobile Holder',
    price: 249,
    stock: 20,
    description: '360-degree rotating dashboard mount with one-hand release grip, fits all phone sizes.',
  },
  {
    name: 'Type-C OTG Adapter',
    category: 'OTG & Adapters',
    price: 99,
    stock: 50,
    description: 'Compact Type-C OTG adapter for connecting pen drives, keyboards and other USB accessories to your phone.',
  },
  {
    name: '3.5mm Aux to Type-C Adapter',
    category: 'OTG & Adapters',
    price: 79,
    stock: 45,
    description: 'Connect wired 3.5mm earphones or aux cables to phones without a headphone jack.',
  },
  {
    name: 'Screen Cleaning Spray Kit',
    category: 'Other',
    price: 89,
    stock: 40,
    description: 'Anti-static cleaning spray with microfiber cloth, safe for screens, camera lenses and tempered glass.',
  },
  {
    name: 'SIM Ejector Pin + Cleaning Kit',
    category: 'Other',
    price: 49,
    stock: 70,
    description: 'Handy SIM ejector pin bundled with a microfiber cleaning cloth and brush for ports and speakers.',
  },
];

const samplePhones = [
  {
    brand: 'Samsung', model: 'Galaxy M31', condition: 'Good', storage: '64GB', color: 'Ocean Blue',
    price: 8499, description: 'Well-maintained, minor scratches on back panel. Battery health good, all functions working. Includes charger.',
  },
  {
    brand: 'Apple', model: 'iPhone 11', condition: 'Excellent', storage: '128GB', color: 'Black',
    price: 21999, description: 'Excellent condition with screen protector and case used since day one. Battery health 87%. Box included.',
  },
  {
    brand: 'OnePlus', model: 'Nord CE 2', condition: 'Good', storage: '128GB', color: 'Bahama Blue',
    price: 12499, description: 'Light usage marks on frame, screen is flawless. Comes with original charger and box.',
  },
  {
    brand: 'Xiaomi', model: 'Redmi Note 11', condition: 'Fair', storage: '64GB', color: 'Space Black',
    price: 6999, description: 'Visible scratches on back cover (screen is fine). Great budget option, fully functional.',
  },
  {
    brand: 'Realme', model: '9 Pro+', condition: 'Excellent', storage: '128GB', color: 'Aurora Green',
    price: 13999, description: 'Barely used, like-new condition. Under warranty period remaining. All accessories included.',
  },
  {
    brand: 'Vivo', model: 'Y21', condition: 'Good', storage: '64GB', color: 'Diamond Glow',
    price: 7499, description: 'Good working condition, minor wear on edges. New battery replaced 2 months ago.',
  },
];

const sampleContactMessages = [
  {
    name: 'Priya Nair', email: 'priya.nair@example.com', phone: '9812345670',
    subject: 'Bulk order for tempered glass', message: 'Hi, I run a small stall nearby and want to order 20 tempered glass units. Can you give a bulk discount?',
  },
  {
    name: 'Amit Verma', email: 'amit.verma@example.com', phone: '9823456781',
    subject: 'Warranty on replacement battery', message: 'I got my phone battery replaced last month, wanted to check how long the warranty lasts.',
  },
];

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) return console.log('Products already exist, skipping.');
  await attachProductImages(sampleProducts);
  await Product.insertMany(sampleProducts);
  console.log(`Seeded ${sampleProducts.length} accessories (with generated images)`);
}

async function seedPhones() {
  const count = await SecondhandPhone.countDocuments();
  if (count > 0) return console.log('Secondhand phones already exist, skipping.');
  await attachPhoneImages(samplePhones);
  await SecondhandPhone.insertMany(samplePhones);
  console.log(`Seeded ${samplePhones.length} secondhand phones (with generated images)`);
}

async function seedDemoCustomer() {
  const existing = await User.findOne({ email: DEMO_CUSTOMER.email });
  if (existing) {
    console.log(`Demo customer already exists: ${DEMO_CUSTOMER.email}`);
    return existing;
  }
  const user = await User.create({ ...DEMO_CUSTOMER, role: 'customer' });
  console.log(`Demo customer created: ${DEMO_CUSTOMER.email} / ${DEMO_CUSTOMER.password}`);
  return user;
}

async function seedRepairRequests(customer) {
  const count = await RepairRequest.countDocuments();
  if (count > 0) return console.log('Repair requests already exist, skipping.');
  await RepairRequest.insertMany([
    {
      user: customer._id, name: customer.name, phone: customer.phone, email: customer.email,
      deviceBrand: 'Samsung', deviceModel: 'Galaxy M31', issueType: 'Display',
      issueDescription: 'Screen has a crack in the top-left corner, touch works fine.',
      status: 'in-progress', estimatedCost: 2200, adminNotes: 'Display ordered, ETA 2 days.',
    },
    {
      name: 'Sunita Rao', phone: '9834567892', email: 'sunita.rao@example.com',
      deviceBrand: 'Xiaomi', deviceModel: 'Redmi Note 10', issueType: 'Battery',
      issueDescription: 'Phone drains battery very quickly and shuts down at 20%.',
      status: 'received',
    },
    {
      name: 'Faizan Sheikh', phone: '9845678903',
      deviceBrand: 'Vivo', deviceModel: 'Y20', issueType: 'Charging Pin',
      issueDescription: 'Phone charges only if cable is held at a specific angle.',
      status: 'completed', estimatedCost: 450, adminNotes: 'Charging port cleaned and pin replaced.',
    },
  ]);
  console.log('Seeded 3 repair requests');
}

async function seedSellRequests(customer) {
  const count = await SellRequest.countDocuments();
  if (count > 0) return console.log('Sell requests already exist, skipping.');
  await SellRequest.insertMany([
    {
      user: customer._id, name: customer.name, phone: customer.phone, email: customer.email,
      deviceBrand: 'OnePlus', deviceModel: '9R', condition: 'Good', expectedPrice: 15000,
      description: '8GB/128GB variant, minor scratches on frame, screen perfect.',
      status: 'contacted', adminNotes: 'Called customer, discussing final price.',
    },
    {
      name: 'Meena Iyer', phone: '9856789014',
      deviceBrand: 'Apple', deviceModel: 'iPhone XR', condition: 'Fair', expectedPrice: 9000,
      description: 'Battery health 79%, back glass has a crack but screen is fine.',
      status: 'pending',
    },
  ]);
  console.log('Seeded 2 sell requests');
}

async function seedOrder(customer) {
  const count = await Order.countDocuments();
  if (count > 0) return console.log('Orders already exist, skipping.');
  const glass = await Product.findOne({ name: /Tempered Glass/ });
  const charger = await Product.findOne({ name: /20W PD Fast Charger/ });
  if (!glass || !charger) return console.log('Skipping order seed — reference products not found.');

  await Order.create({
    user: customer._id,
    items: [
      { itemType: 'Product', itemId: glass._id, name: glass.name, price: glass.price, qty: 2 },
      { itemType: 'Product', itemId: charger._id, name: charger.name, price: charger.price, qty: 1 },
    ],
    customerName: customer.name,
    phone: customer.phone,
    address: 'Flat 302, Sai Krupa CHS, Malad East, Mumbai',
    status: 'pending',
    totalAmount: glass.price * 2 + charger.price,
  });
  console.log('Seeded 1 sample order');
}

async function seedContactMessages() {
  const count = await ContactMessage.countDocuments();
  if (count > 0) return console.log('Contact messages already exist, skipping.');
  await ContactMessage.insertMany(sampleContactMessages);
  console.log(`Seeded ${sampleContactMessages.length} contact messages`);
}

async function run() {
  await connectDB();

  const adminEmail = (process.env.ADMIN_EMAIL || 'aa6871678@gmail.com').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log(`Admin already exists: ${adminEmail}`);
  } else {
    await User.create({
      name: process.env.ADMIN_NAME || 'SP Mobile Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
      phone: process.env.ADMIN_PHONE || '9653206528',
      role: 'admin',
    });
    console.log(`Admin created: ${adminEmail}`);
  }

  const customer = await seedDemoCustomer();
  await seedProducts();
  await seedPhones();
  await seedRepairRequests(customer);
  await seedSellRequests(customer);
  await seedOrder(customer);
  await seedContactMessages();

  await mongoose.disconnect();
  console.log('Seeding complete');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
