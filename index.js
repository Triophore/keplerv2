require('dotenv').config();
const chalk = require('chalk');
const path = require('path');
/**
   * Triophore Logo and contact details
   */

const start = async () => {
const log = console.log;
 console.log("");
 console.log("");
 console.log("");
 log(` MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
 MMMMMMMMMMMMMMMMMMNXNWMMMMMMMMMMMMMMMMMM
 MMMMMMMMMMMMMMMMMXl',dNMMMMMMMMMMMMMMMMM
 MMMMMMMMMMMMMMMMMX:  .oNMMMMMMMMMMMMMMMM
 MMMMMMMMMMMMMMWK0WXc.  cXMMMMMMMMMMMMMMM
 MMMMMMMMMMMMMWO'.dNX0l. :KMMMMMMMMMMMMMM
 MMMMMMMMMMMMWx.  .lNMNd. ,OWMMMMMMMMMMMM
 MMMMMMMMMMMNd. ',  cOXWx. 'kWMMMMMMMMMMM
 MMMMMMMMMMXl. :KXl. .;KWO' .xWMMMMMMMMMM
 MMMMMMMMMKc  cXMMNd.  ,OW0; .oNMMMMMMMMM
 MMMMMMMM0; .oNNxoXWx:. 'kWK: .lXMMMMMMMM
 MMMMMMWO, .dNXl. ;KWWO' .xNXl  :KMMMMMMM
 MMMMMWk. .kWKc    ,OWW0; .oNNo. ;0MMMMMM
 MMMMNd. 'OW0;      'ckWK: .lXNx. 'OWMMMM
 MMMNo. ;0WK:.........,OWXl  :KWk. .xWMMM
 MMXc  :KMMNK0000000000XWMNo. ;0WO, .dNMM
 MK:  .;lllllllllllllllllxXNx. .cl,  .lXM
 Nd,.....................,xNWk;.......,xW
 WNNNNNNNNNNNNNNNNNNNNNNNNNWMMWNNNNNNNNNW
 MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
 `);
 console.log("");
 console.log("");
 console.log("------------------------------------------------------------------------------------------------------");
 console.log("");
 console.log(chalk.blue("Thank you for installing Kepler"));
 console.log("");
 //log(chalk.green("By Triophore Technologies [https://triophore.com]"));
 console.log("");
 //log(chalk.blue("Please visit :: https://triophore.com/products/kepler for more info"));
 console.log("------------------------------------------------------------------------------------------------------");
 
var config = require('./confing/index');
const GracefulServer = require('@gquittet/graceful-server');

var models_loaded = require('require-all')({
  dirname     :  path.join(__dirname,'models'),
  filter      :  /(.+model)\.js$/,
  excludeDirs :  /^\.(git|svn)$/,
  recursive   : false
});
const mongoose = require('mongoose');
//const mongooseConnection = await mongoose.createConnection(process.env.MONGODB, { useNewUrlParser: true });

//await require('mongoose-schema-jsonschema')(mongoose);



var p_models = parse_model(models_loaded);
var model_def = {};
mongoose_models = [];
(await p_models).forEach(function(value){
 // mongoose_models[value.name] = mongoose.model(value.name, value.schema);
  value.alias = value.name;
  mongoose_models.push(value);
  //const Schema = mongoose.Schema;
  //const tempSchema = new Schema(value.schema);
  //const jsonSchema = tempSchema.jsonSchema();
  //model_def[value.name] = jsonSchema;
});

const fastify = require('fastify')({ logger: {
  prettyPrint: true,
  level: 'trace'
}});

await fastify.register(
  require("fastify-mongoose-driver").plugin,
  {
    uri: process.env.MONGODB,
    settings: {
      useNewUrlParser: true,
      config: {
        autoIndex: true,
      },
    },
    models: mongoose_models,
    useNameAndAlias: false,
  },
  (err) => {
    if (err) throw err;
  }
);

await require('mongoose-schema-jsonschema')(fastify.mongoose.instance);



const gracefulServer = GracefulServer(fastify.server)

gracefulServer.on(GracefulServer.READY, () => {
  console.log('Server is ready')
})

gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
  console.log('Server is shutting down')
})

gracefulServer.on(GracefulServer.SHUTDOWN, error => {
  console.log('Server is down because of', error.message)
})

await fastify.register(require('fastify-cors'), {})

await fastify.register(require("fastify-blipp"));

await fastify.register(require('fastify-formbody'));

//console.log(mongooseConnection.models)



await fastify.register(require('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info:config.documentation.info,
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: process.env.HOST+':'+process.env.PORT,
      schemes: ['http','https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      /*tags: [
        { name: 'user', description: 'User related end-points' },
        { name: 'code', description: 'Code related end-points' }
      ],*/
      //definitions:model_def ,
      securityDefinitions: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        }
      }
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true
  })

  
  await fastify.register(require('fastify-mongoose-api'), {  /// here we are registering our plugin
    models: fastify.mongoose.instance.models,  /// Mongoose connection models
    prefix: '/api/',                    /// URL prefix. e.g. http://localhost/api/...
    setDefaults: true,                  /// you can specify your own api methods on models, our trust our default ones, check em [here](https://github.com/jeka-kiselyov/fastify-mongoose-api/blob/master/src/DefaultModelMethods.js)
    methods: ['list', 'get', 'post', 'patch', 'put', 'delete', 'options'] /// HTTP methods
  });
  

console.log(fastify.mongoose.instance.models.user.schema.jsonSchema())

fastify.get('/', async (request, reply) => {
return { hello: 'world' }
})


try {
    await fastify.listen(process.env.PORT,process.env.HOST);
    gracefulServer.setReady();
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}
}
start()


async function parse_model(_models){
  var models_parsed = [];
  for (var key in _models){           
      if(_models[key].hasOwnProperty("name") && _models[key].hasOwnProperty("schema") ) {
          models_parsed.push(_models[key])
      }
      /*
      else{
          var d = get_sub_model(_models[key]);
          for(var r in d){
              models_parsed.push(d[r]);
          } 
      }*/
  }
  return models_parsed;
}