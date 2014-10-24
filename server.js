var _ = require('koa-route');
var koa = require('koa');
var app = koa();

var attendees = require('./');

app.use(_.get('/attendees', attendees.list));
app.use(_.get('/attendees/:id', attendees.index));
app.use(_.post('/attendees', attendees.create));
app.use(_.put('/attendees/:id', attendees.update));

app.listen(3000);

console.log('Listening on port 3000.');
console.log('Inital database:', JSON.stringify(
  attendees.db(process.argv[2] === '-v'), null, '  '
));
