#!/bin/bash

# 1142 LABS AI API - Environment Variables Setup Script
# Run this to set environment variables in Vercel

echo "🤖 1142 LABS AI API - Environment Variable Setup"
echo "================================================"
echo ""
echo "This script will help you set up API keys in Vercel."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📝 Please enter your API keys:"
echo ""

# Get API keys
read -p "Grok (xAI) API Key: " XAI_KEY
read -p "OpenAI API Key: " OPENAI_KEY
read -p "Google Gemini API Key: " GEMINI_KEY

echo ""
echo "🔐 Setting environment variables in Vercel..."
echo ""

# Set environment variables
vercel env add XAI_API_KEY production <<< "$XAI_KEY"
vercel env add XAI_API_KEY preview <<< "$XAI_KEY"
vercel env add XAI_API_KEY development <<< "$XAI_KEY"

vercel env add OPENAI_API_KEY production <<< "$OPENAI_KEY"
vercel env add OPENAI_API_KEY preview <<< "$OPENAI_KEY"
vercel env add OPENAI_API_KEY development <<< "$OPENAI_KEY"

vercel env add GEMINI_API_KEY production <<< "$GEMINI_KEY"
vercel env add GEMINI_API_KEY preview <<< "$GEMINI_KEY"
vercel env add GEMINI_API_KEY development <<< "$GEMINI_KEY"

echo ""
echo "✅ Environment variables set successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Test API endpoint: curl -X POST https://your-domain.vercel.app/api/ai -H 'Content-Type: application/json' -d '{\"model\":\"grok\",\"prompt\":\"Test\"}'"
echo ""
