// config.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'; // Make sure you have dotenv installed: npm install dotenv

dotenv.config(); // Load environment variables from .env file

// Access your API key as an environment variable
const API_KEY = process.env.GEMINI_API_KEY; // Or whatever you named your environment variable

if (!API_KEY) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    // You might want to throw an error or exit the process here
    process.exit(1);
}

// Initialize the Google Generative AI client
export const ai = new GoogleGenerativeAI(API_KEY);

console.log("GoogleGenerativeAI client initialized.");