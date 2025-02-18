import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
initializeApp({
  credential: cert({
    projectId: "shoply-ea664",
    clientEmail: "firebase-adminsdk-j8k9f@shoply-ea664.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9QFbJXqI3zrQo\n1J8Z8Z9w8z8CvJ3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J\n3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J\n3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J\n3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J\n3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J3Z3J\n3Z3J3Z3JAgMBAAECggEAC7J9\n-----END PRIVATE KEY-----\n"
  })
});

const db = getFirestore();

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Sell up to 10 products',
      'Basic AI chat',
      '3% transaction fee'
    ],
    maxProducts: 10,
    transactionFee: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    features: [
      'Unlimited products',
      'AI recommendations',
      'Custom branding',
      '2% transaction fee'
    ],
    maxProducts: -1, // unlimited
    transactionFee: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    features: [
      'Abandoned cart recovery',
      'Multi-language support',
      'Analytics dashboard',
      '1% transaction fee'
    ],
    maxProducts: -1,
    transactionFee: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    features: [
      'Custom AI models',
      'API access',
      '0% transaction fee',
      'Dedicated support'
    ],
    maxProducts: -1,
    transactionFee: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function initializePlans() {
  const batch = db.batch();
  
  for (const plan of plans) {
    const docRef = db.collection('plans').doc(plan.id);
    batch.set(docRef, plan);
  }
  
  try {
    await batch.commit();
    console.log('All plans initialized successfully');
  } catch (error) {
    console.error('Error initializing plans:', error);
    throw error;
  }
}

// Run the initialization
initializePlans()
  .then(() => {
    console.log('Data initialization completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize data:', error);
    process.exit(1);
  });