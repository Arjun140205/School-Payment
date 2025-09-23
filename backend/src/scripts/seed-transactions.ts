import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-payment';

// Define the number of sample transactions to create
const NUM_TRANSACTIONS = 20;

// Status options for random selection
const statuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
const paymentModes = ['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET'];

// Define interfaces for our data models
interface Order {
  _id: ObjectId;
  school_id: string;
  trustee_id: string;
  gateway_name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderStatus {
  collect_id: ObjectId;
  order_amount: number;
  transaction_amount: number;
  payment_mode: string;
  payment_details: string;
  bank_reference: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Function to create a random order amount
function getRandomAmount(): number {
  return Math.floor(Math.random() * 10000) + 500; // Random amount between 500 and 10500
}

// Function to get a random element from an array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to create sample data
async function seedDatabase() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Get existing school IDs or create a default one
    let schoolId = 'default-school-001';
    const schools = await db.collection('users').find({ role: 'school' }).limit(1).toArray();
    if (schools.length > 0) {
      schoolId = schools[0].schoolId || schoolId;
    }
    
    console.log(`Using school ID: ${schoolId}`);
    
    // Create sample orders
    const orders: Order[] = [];
    for (let i = 0; i < NUM_TRANSACTIONS; i++) {
      const orderId = new ObjectId();
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // Random date within the last 30 days
      
      orders.push({
        _id: orderId,
        school_id: schoolId,
        trustee_id: new ObjectId().toString(),
        gateway_name: 'Test Payment Gateway',
        createdAt: createdAt,
        updatedAt: createdAt
      });
    }
    
    // Insert orders
    if (orders.length > 0) {
      const orderResult = await db.collection('orders').insertMany(orders);
      console.log(`${orderResult.insertedCount} orders inserted`);
    }
    
    // Create order statuses for each order
    const orderStatuses: OrderStatus[] = [];
    for (const order of orders) {
      const orderAmount = getRandomAmount();
      const status = getRandomElement(statuses);
      const transactionAmount = status === 'FAILED' ? 0 : orderAmount;
      
      orderStatuses.push({
        collect_id: order._id,
        order_amount: orderAmount,
        transaction_amount: transactionAmount,
        payment_mode: getRandomElement(paymentModes),
        payment_details: 'Sample payment details',
        bank_reference: randomUUID(),
        status: status,
        createdAt: order.createdAt,
        updatedAt: order.createdAt
      });
    }
    
    // Insert order statuses
    if (orderStatuses.length > 0) {
      const statusResult = await db.collection('orderstatuses').insertMany(orderStatuses);
      console.log(`${statusResult.insertedCount} order statuses inserted`);
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedDatabase().catch(console.error);