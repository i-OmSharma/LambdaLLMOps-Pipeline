#!/bin/bash

# Test the connection between frontend and Lambda backend
set -e

echo "🧪 Testing frontend-backend connection..."

# Test the Lambda API directly
echo "📡 Testing Lambda API directly..."
LAMBDA_URL="https://tgo3o9jshk.execute-api.ap-south-1.amazonaws.com/Prod/chat"

curl -X POST $LAMBDA_URL \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "context_file": "demo_context.json"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "✅ Lambda API test completed"

# Test the Next.js API route (if frontend is running)
echo ""
echo "🌐 Testing Next.js API route..."
echo "Note: Make sure your frontend is running on http://localhost:3000"

curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "context_file": "demo_context.json"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "✅ Connection test completed" 