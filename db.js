const mongoose = require('mongoose')
const conectDB = async () => {
  mongoose.set('strictQuery', true)
  await mongoose.connect('mongodb+srv://WebCoder:webcoder52&67@cluster0.fa4q6fl.mongodb.net/mynetwork', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    
});
console.log("MongoDB Connected");
}

  
module.exports = conectDB 