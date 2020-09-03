// const express = require('express');
// const bodyParser = require('body-parser');

// const dishRouter = express.Router();

// dishRouter.use(bodyParser.json());

// dishRouter.route('/')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res, next) => {
//     res.end('Will send all the dishes');
// })
// .post((req, res, next) => {
//     res.end(`Will add dish with name: ${req.body.name} with details ${req.body.description}`);
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end(`PUT operation is not allowed on "/dishes" path`);
// })
// .delete((req, res, next) => {
//     res.end('Will delete all the dishes!');
// });

// dishRouter.route('/:dishId')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res, next) => {
//     res.end(`Will send the details of dish with ID: ${req.params.dishId}`)
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end(`POST operation is not allowed on /dishes/${req.url} path`);
// })
// .put((req, res, next) => {
//     res.write(`Updating dish with ID: ${req.params.dishId}`);
//     res.end(`Will update dish name: ${req.body.name} with details: ${req.body.description}`);
// })
// .delete((req, res, next) => {
//     res.end(`Will delete the dish with ID: ${req.params.dishId}`);
// });

// module.exports = dishRouter;

const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) =>{
    res.end('Will send all the dishes to you');
})
.post((req, res, next) =>{
    res.end('Will add the dish : ' + req.body.name + ' with details : ' +req.body.description);
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes');
})
.delete((req, res, next) =>{
    res.end('Deleting all the dishes!');
});


dishRouter.route('/:dishId')
.get((req, res, next) =>{
    res.end('Will send details of the dish: '
    + req.params.dishId + ' to you!');
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'
    + req.params.dishId);
})
.put((req, res, next) =>{
    res.write('Updating the dish: '
    +req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + 
    ' with details: ' +req.body.description);
})
.delete((req, res, next) =>{
    res.end('Deleting dish: ' +req.params.dishId);
});

module.exports = dishRouter;