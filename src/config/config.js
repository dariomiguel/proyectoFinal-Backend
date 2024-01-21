import dotenv from 'dotenv';

dotenv.config();

const config = {
    persistence: process.env.PERSISTENCE,

    adminEmail: process.env.ADMIN_EMAIL,
    adminPass: process.env.ADMIN_PASSWORD,

    githubId: process.env.CLIENT_ID,
    githubSecret: process.env.CLIENT_SECRET,
    githubUrl: process.env.CALLBACK_URL,

    urlMongo: process.env.MONGO_URL,
};

export default config;
