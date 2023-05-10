const mongoose = require('mongoose')
const conectDB = async () => {
  mongoose.set('strictQuery', true)
  await mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    
});
console.log("MongoDB Connected");
}

  
module.exports = conectDB 
