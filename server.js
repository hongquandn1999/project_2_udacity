import bodyParser from 'body-parser';
import express from 'express';
import { deleteLocalFiles, filterImageFromURL } from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get('/filteredimage', async (req, res) => {
  const { image_url } = req.query;

  // 1. validate the image_url query
  if (!image_url) {
    return res.status(400).send({ message: 'image_url is required' });
  }

  try {
    // 2. call filterImageFromURL(image_url) to filter the image
    const filteredPath = await filterImageFromURL(image_url);

    // 3. send the resulting file in the response
    res.sendFile(filteredPath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      } else {
        // 4. deletes any files on the server on finish of the response
        deleteLocalFiles([filteredPath]);
      }
    });
  } catch (error) {
    res
      .status(422)
      .send({ message: 'Unable to process image', error: error.toString() });
  }
});

/**************************************************************************** */

//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get('/', async (req, res) => {
  res.send('try GET /filteredimage?image_url={{}}');
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
