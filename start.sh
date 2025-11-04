#!/bin/bash

# DLX Command Center Startup Script

echo "🚀 Starting DLX Command Center - Lux 2.0 Turbo HUD"
echo "================================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local file not found!"
    echo "   Creating from template..."
    cp .env.local.template .env.local 2>/dev/null || true
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✨ Starting backend server (port 3001)..."
echo "✨ Starting frontend dev server (port 3000)..."
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo "🔐 Default password: lux2.0"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Run both servers
npm start
