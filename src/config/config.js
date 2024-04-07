import dotenv from "dotenv";

dotenv.config();

const config = {
    persistence: process.env.PERSISTENCE,

    adminEmail: process.env.ADMIN_EMAIL,
    adminPass: process.env.ADMIN_PASSWORD,

    privateKey: process.env.PRIVATE_KEY,

    githubId: process.env.CLIENT_ID,
    githubSecret: process.env.CLIENT_SECRET,
    githubUrl: process.env.CALLBACK_URL,

    urlMongo: process.env.MONGO_URL,

    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,

    stripeKey: process.env.STRIPE_KEY
};

export default config;
