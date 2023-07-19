const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // Replace with your desired port number

app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { req: newMessage, session, person } = req.body;

    // Here, you can perform any additional processing or validation on the user response
    // and user data before sending it to the backend endpoint.

    const payload = {
      user_id: session.user.email,
      conversation_id: person.id,
      user_query: newMessage,
    };
    console.log(payload);

    // Replace '/your-backend-endpoint' with the actual backend endpoint that you want to send the payload to
    const response = await axios.post('http://localhost:8000/tarih/me', payload);
    const responseData = response.data;

    // You can handle the responseData as per your requirements and send it back to the client if needed.

    res.status(200).json({ responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});