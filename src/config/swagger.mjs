import swaggerJSDoc from "swagger-jsdoc";
import fs from 'fs'
import yaml from 'js-yaml'

const componentsDoc = yaml.load(fs.readFileSync('./docs/swagger.yaml', 'utf-8'))
const newsComponents = yaml.load(fs.readFileSync('./docs/newsSchema.yaml', 'utf-8'))
const admissionComponents = yaml.load(fs.readFileSync('./docs/admission.yaml', 'utf-8'))
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DMU WEB API',
            version: '1.0.0',
            description: 'API documentation for Debre Markos University Backend',
        },
        servers: [
            { url: 'http://localhost:3000/admin', description: 'admin subdomain'},
            { url: 'http://localhost:3000/cda', description: 'CDA subdomain'},
            { url: 'http://localhost:3000/studentPortal', description: 'students subdomain'},
            { url: 'http://localhost:3000', description: ' main domain'},
        ],
        components: {
          securitySchemes: {
                bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
            },
  schemas: {
    ...componentsDoc.components.schemas,
    ...newsComponents.components.schemas,
    ...admissionComponents.components.schemas,
  },
},
security: [
   {
    bearerAuth: []
   }
],
    },
    apis: ['./src/routes/**/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec;