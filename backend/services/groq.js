const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function askAI(prompt) {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile', // Updated to latest supported model
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful financial advisor AI that provides clear, concise advice on expense management and budgeting.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.3,
        max_tokens: 500, // Increased for more detailed responses
        top_p: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw new Error('AI service unavailable');
  }
}

module.exports = { askAI };
