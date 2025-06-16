# AWS Lightsail Server Management API

This Express application provides endpoints to manage an AWS Lightsail server instance.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_region
LIGHTSAIL_INSTANCE_NAME=your_instance_name
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Get Server Status
- **GET** `/api/status`
- Returns the current status and IP address of the server

### Stop Server
- **POST** `/api/stop`
- Initiates server shutdown

### Start Server
- **POST** `/api/start`
- Initiates server startup

## Security Note
Make sure to:
1. Keep your AWS credentials secure
2. Add `.env` to your `.gitignore` file
3. Use appropriate security measures in production (HTTPS, authentication, etc.) 