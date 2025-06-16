require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

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

// Get server status
app.get('/api/status', async (req, res) => {
  try {
    const params = {
      instanceName: process.env.LIGHTSAIL_INSTANCE_NAME
    };

    const data = await lightsail.getInstance(params).promise();
    const instance = data.instance;

    res.json({
      status: instance.state.name,
      ip: instance.publicIpAddress,
      name: instance.name
    });
  } catch (error) {
    console.error('Error getting instance status:', error);
    res.status(500).json({ error: 'Failed to get instance status' });
  }
});

// Stop server
app.post('/api/stop', async (req, res) => {
  try {
    const params = {
      instanceName: process.env.LIGHTSAIL_INSTANCE_NAME
    };

    await lightsail.stopInstance(params).promise();
    res.json({ message: 'Server stop initiated successfully' });
  } catch (error) {
    console.error('Error stopping instance:', error);
    res.status(500).json({ error: 'Failed to stop instance' });
  }
});

// Start server
app.post('/api/start', async (req, res) => {
  try {
    const params = {
      instanceName: process.env.LIGHTSAIL_INSTANCE_NAME
    };

    await lightsail.startInstance(params).promise();
    res.json({ message: 'Server start initiated successfully' });
  } catch (error) {
    console.error('Error starting instance:', error);
    res.status(500).json({ error: 'Failed to start instance' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 