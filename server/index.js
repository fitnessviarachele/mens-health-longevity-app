import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.post('/send-sms', async (req, res) => {
  const { to, body } = req.body || {};
  if (!to || !body) return res.status(400).json({ error: 'Missing to or body' });
  
  // Check if Twilio is properly configured
  const hasTwilio = process.env.TWILIO_ACCOUNT_SID && 
                   process.env.TWILIO_AUTH_TOKEN && 
                   process.env.TWILIO_FROM &&
                   process.env.TWILIO_ACCOUNT_SID !== 'your_sid' &&
                   process.env.TWILIO_AUTH_TOKEN !== 'your_token';
  
  if (!hasTwilio) {
    // Mock SMS sending for development
    console.log(`📱 MOCK SMS to ${to}: ${body}`);
    console.log('💡 To use real SMS, set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM environment variables');
    return res.json({ sid: 'mock-' + Date.now(), mock: true });
  }
  
  try {
    const { default: twilio } = await import('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const msg = await client.messages.create({ to, from: process.env.TWILIO_FROM, body });
    res.json({ sid: msg.sid });
  } catch (err) {
    const message = err.message || String(err);
    if (message.includes('Authentication Error') || message.toLowerCase().includes('invalid username') || message.includes('401')) {
      console.warn('Twilio authentication failed, falling back to mock SMS:', message);
      console.log(`📱 MOCK SMS to ${to}: ${body}`);
      return res.json({ sid: 'mock-' + Date.now(), mock: true, warning: 'Twilio auth failed, using mock SMS.' });
    }
    res.status(500).json({ error: message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`SMS server listening on ${port}`));
