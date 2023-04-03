const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dvlxatj0a",
  api_key: "372421991579559",
  api_secret: "5RvZ6OudQFHTK5W0SOXzGipI7xA"
});

module.exports = {cloudinary}
