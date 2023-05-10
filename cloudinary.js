const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: ""
});

module.exports = {cloudinary}
