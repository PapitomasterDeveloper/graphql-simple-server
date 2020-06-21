// Requiring express dependency
const express = require('express');

// Creating an instance of express
const app = express();

// Accessing the express instance to create a server to access to port 4000
app.listen(4000, () => {
	console.log(`Server is running on port 4000..`);
});
