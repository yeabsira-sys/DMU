import swaggerJSDoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DMU WEB API',
            version: '1.0.0',
            description: 'API documentation for Debre Markos University Backend',
        },
        servers: [
            { url: 'http://admin.localhost:3000', description: 'admin subdomain'},
            { url: 'http://cda.localhost:3000', description: 'CDA subdomain'},
            { url: 'http://stdportal.localhost:3000', description: 'students subdomain'},
            { url: 'http://localhost:3000', description: ' main domain'},
        ],
    },
    apis: ['./src/routes/**/*.mjs'],
};

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec;