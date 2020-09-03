// const express = require('express');
// const bodyParser = require('body-parser');

// const promoRouter = express.Router();

// promoRouter.use(bodyParser.json());

// promoRouter.route('/')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res, next) => {
//     res.end('Will send all the promotions');
// })
// .post((req, res, next) => {
//     res.end(`Will add promotion with name: ${req.body.name} with details ${req.body.description}`);
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end(`PUT operation is not allowed on "/promotions" path`);
// })
// .delete((req, res, next) => {
//     res.end('Will delete all the promotions!');
// });

// promoRouter.route('/:promoId')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res, next) => {
//     res.end(`Will send the details of promotion with ID: ${req.params.promoId}`)
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end(`POST operation is not allowed on /promotions/${req.url} path`);
// })
// .put((req, res, next) => {
//     res.write(`Updating promotion with ID: ${req.params.promoId}`);
//     res.end(`Will update promotion name: ${req.body.name} with details: ${req.body.description}`);
// })
// .delete((req, res, next) => {
//     res.end(`Will delete the promotion with ID: ${req.params.promoId}`);
// });

// module.exports = promoRouter;

const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) =>{
    res.end('Will send all the promotions to you');
})
.post((req, res, next) =>{
    res.end('Will add the promotion : ' + req.body.name + ' with details : ' +req.body.description);
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.end('Put operation not supported on /promotions');
})
.delete((req, res, next) =>{
    res.end('Deleting all the promotions!');
});


promoRouter.route('/:promoId')
.get((req, res, next) =>{
    res.end('Will send details of the promotion: '
    + req.params.promoId + ' to you!');
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'
    + req.params.promoId);
})
.put((req, res, next) =>{
    res.write('Updating the promotion: '
    +req.params.promoId + '\n');
    res.end('Will update the promotion: ' + req.body.name + 
    ' with details: ' +req.body.description);
})
.delete((req, res, next) =>{
    res.end('Deleting promotion: ' +req.params.promoId);
});

module.exports = promoRouter;