import { useUser } from '@clerk/nextjs';

const clerkConfig = {
    // Configuration de Clerk
    apiKey: process.env.CLERK_API_KEY,
    apiSecret:sk_test_ah3ulTeOdut9dQBayUafzsGOXZJv5BUfpTmrOYmqPl,
    
    publishableKey:pk_test_cmVsZXZhbnQtc3F1aWQtMjMuY2xlcmsuYWNjb3VudHMuZGV2JA,
    secretKey: process.env.CLERK_SECRET_KEY, 

};

export { useUser, clerkConfig };