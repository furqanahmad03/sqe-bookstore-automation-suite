# Use official Playwright image with all browsers
FROM mcr.microsoft.com/playwright:focal

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Install browsers (already included, but ensures everything)
RUN npx playwright install --with-deps

# Expose Next.js default port
EXPOSE 3000

# Start Next.js server and run tests sequentially
# Use "wait-on" to ensure server is ready before running tests
CMD npm run build && npm run start & \
    npx wait-on http://localhost:3000 && \
    npx playwright test --reporter=list
