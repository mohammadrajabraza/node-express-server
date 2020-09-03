// const express = require('express');
// const bodyParser = require('body-parser');

// const leaderRouter = express.Router();

// leaderRouter.use(bodyParser.json());

// leaderRouter.route('/')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res, next) => {
//     res.end('Will send all the leaders');
// })
// .post((req, res, next) => {
//     res.end(`Will add leader with name: ${req.body.name} with details ${req.body.description}`);
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end(`PUT operation is not allowed on "/leaders" path`);
// })
// .delete((req, res, next) => {
//     res.end('Will delete all the leaders!');
// });

// leaderRouter.route('/:leaderId')
// .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req, res, next) => {
//     res.end(`Will send the details of leader with ID: ${req.params.leaderId}`)
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end(`POST operation is not allowed on /leaders/${req.url} path`);
// })
// .put((req, res, next) => {
//     res.write(`Updating leader with ID: ${req.params.leaderId}`);
//     res.end(`Will update leader name: ${req.body.name} with details: ${req.body.description}`);
// })
// .delete((req, res, next) => {
//     res.end(`Will delete the leader with ID: ${req.params.leaderId}`);
// });

// module.exports = leaderRouter;

const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) =>{
    res.end('Will send all the leaders to you');
})
.post((req, res, next) =>{
    res.end('Will add the leader : ' + req.body.name + ' with details : ' +req.body.description);
})
.put((req, res, next) =>{
    res.statusCode = 403;
    res.end('Put operation not supported on /leaders');
})
.delete((req, res, next) =>{
    res.end('Deleting all the leaders!');
});


leaderRouter.route('/:leaderId')
.get((req, res, next) =>{
    res.end('Will send details of the leader: '
    + req.params.leaderId + ' to you!');
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'
    + req.params.leaderId);
})
.put((req, res, next) =>{
    res.write('Updating the leader: '
    +req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + 
    ' with details: ' +req.body.description);
})
.delete((req, res, next) =>{
    res.end('Deleting leader: ' +req.params.leaderId);
});

module.exports = leaderRouter;