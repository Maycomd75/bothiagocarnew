const mongoose = require('mongoose');

// Substitua <db_password> pela sua senha real do MongoDB
const uri = 'mongodb+srv://Hiagocar:<9264521>@hiagocar.zehmz.mongodb.net/?retryWrites=true&w=majority&appName=hiagocar';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conexão com o MongoDB bem-sucedida!');
})
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

module.exports = mongoose;