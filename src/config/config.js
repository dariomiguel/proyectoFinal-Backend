//!! NO TERMINADO!!!
//TODO agregar a la clase las variables que se van a usar, y pasar socketConfig a la carpeta config
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const config = {
    apiKey: process.env.API_KEY,
    databaseURL: process.env.DATABASE_URL,
    // Agrega otras configuraciones según sea necesario
};

export default config;
