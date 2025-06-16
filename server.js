require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const REQUEST_TIMEOUT_MS = 15000; // 10 seconds timeout

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const lightsail = new AWS.Lightsail();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to add timeout to AWS requests
const withTimeout = (promise) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), REQUEST_TIMEOUT_MS);
  });
  return Promise.race([promise, timeoutPromise]);
};

// Get server status
app.get('/api/status', async (req, res) => {
  try {
    const params = {
      instanceName: process.env.LIGHTSAIL_INSTANCE_NAME
    };

    const data = await withTimeout(lightsail.getInstance(params).promise());
    const instance = data.instance;

    res.json({
      status: instance.state.name,
      ip: instance.publicIpAddress,
      name: instance.name
    });
  } catch (error) {
    console.error('Error getting instance status:', error);
    if (error.message === 'Request timeout') {
      res.status(504).json({ error: `Request timed out after ${REQUEST_TIMEOUT_MS/1000} seconds` });
    } else {
      res.status(500).json({ error: 'Failed to get instance status' });
    }
  }
});

// Stop server
app.post('/api/stop', async (req, res) => {
  try {
    const params = {
      instanceName: process.env.LIGHTSAIL_INSTANCE_NAME
    };

    await withTimeout(lightsail.stopInstance(params).promise());
    res.json({ message: 'Server stop initiated successfully' });
  } catch (error) {
    console.error('Error stopping instance:', error);
    if (error.message === 'Request timeout') {
      res.status(504).json({ error: `Request timed out after ${REQUEST_TIMEOUT_MS/1000} seconds` });
    } else {
      res.status(500).json({ error: 'Failed to stop instance' });
    }
  }
});

// Start server
app.post('/api/start', async (req, res) => {
  try {
    const params = {
      instanceName: process.env.LIGHTSAIL_INSTANCE_NAME
    };

    await withTimeout(lightsail.startInstance(params).promise());
    res.json({ message: 'Server start initiated successfully' });
  } catch (error) {
    console.error('Error starting instance:', error);
    if (error.message === 'Request timeout') {
      res.status(504).json({ error: `Request timed out after ${REQUEST_TIMEOUT_MS/1000} seconds` });
    } else {
      res.status(500).json({ error: 'Failed to start instance' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 