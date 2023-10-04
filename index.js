const express = require('express');
const app = express();
const port = 3000;
const http = require('http').createServer(app);
const newEntitiesRoutes = require('./routes/new-entities.routes');
const newCompaniesRoutes = require('./routes/new-companies.routes');
const newRegionsRoutes = require('./routes/new-regions.routes');
const newEnvironmentsRoutes = require('./routes/new-environments.routes');
const newInfrastructureRoutes = require('./routes/new-infrastructure.routes');

const cockieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');

//crea la ruta inciia y conectala a un html
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/assets'));
app.use(express.static(__dirname + '/public/js'));
const path = require('path');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});



app.use(cockieParser());


app.use(bodyParser.urlencoded({

  extended: false,

  limit: '50mb'

}));


app.use(bodyParser.json({

  limit: '50mb'

}));



app.use(express.json());

app.use(cors());

app.use('/newentities', newEntitiesRoutes);
app.use('/newcompanies', newCompaniesRoutes);
app.use('/newregions', newRegionsRoutes);
app.use('/newenvironments', newEnvironmentsRoutes);
app.use('/newinfrastructure', newInfrastructureRoutes);




http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



