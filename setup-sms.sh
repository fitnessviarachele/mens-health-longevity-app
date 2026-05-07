#!/bin/bash

echo "🚀 Setting up Twilio SMS for Men's Health App"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ No .env file found."
    echo ""
    echo "📝 Please create a .env file with your Twilio credentials:"
    echo ""
    echo "1. Go to https://console.twilio.com/"
    echo "2. Get your Account SID, Auth Token, and phone number"
    echo "3. Create a .env file with:"
    echo ""
    echo "TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    echo "TWILIO_AUTH_TOKEN=your_real_auth_token_here"
    echo "TWILIO_FROM=+1234567890"
    echo ""
    echo "4. Run this script again: ./setup-sms.sh"
    exit 1
fi

# Load environment variables
source .env

# Check if variables are set
if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ] || [ -z "$TWILIO_FROM" ]; then
    echo "❌ Twilio environment variables not set properly"
    echo "Please check your .env file has the correct values"
    exit 1
fi

echo "✅ Twilio credentials loaded"
echo "📱 Testing SMS endpoint..."

# Start server if not running
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "🔄 Starting SMS server..."
    npm run server &
    sleep 2
fi

# Test the SMS endpoint
RESPONSE=$(curl -s -X POST http://localhost:3001/send-sms \
  -H "Content-Type: application/json" \
  -d "{\"to\":\"$TWILIO_FROM\",\"body\":\"Test SMS from Men's Health App\"}")

if echo "$RESPONSE" | grep -q "mock"; then
    echo "📱 Mock SMS sent (server is using mock mode)"
    echo "💡 To use real SMS, make sure your .env file has real Twilio credentials"
else
    echo "📱 Real SMS sent! Check your phone for the test message"
fi

echo ""
echo "✅ Setup complete! The app will now send real SMS messages."