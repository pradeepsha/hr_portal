let express = require('express');
var cors = require('cors');
const validator = require("express-validator");
var path = require('path');

require('./config/database.js')

var authRouter = require("./routes/auth");
var adminRouter = require("./routes/admin.js");
let app = express();
const port = 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.json({
    limit: '2048mb', extended: true
}));

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '2048mb', extended: true
  }));


  const { swaggerServe, swaggerSetup } = require('./config/swagger.config.js')  
  app.use("/api-docs", swaggerServe, swaggerSetup); 


app.use('/auth', authRouter);
app.use('/api/admin/', adminRouter);


// Enable CORS for all requests
app.use(cors());
app.use(express.static(path.join(__dirname, 'angular/browser')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// If you want to restrict CORS to specific origins, you can pass configuration options to the cors function.
// For example, to allow requests from http://example.com, you can specify:
// app.use(cors({
//     origin: 'http://example.com'
//   }));


  

const HOST = '127.0.0.1'

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})

// app.get('*',(req,res)=>{
//     res.send('Hello, World!\n Pradeep');
// })


app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/angular/browser/index.html'));
});