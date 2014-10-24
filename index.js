var getRawBody = require('raw-body');
var t = require('transit-js');

var Attendee = function(name, email) {
  this.name = name;
  this.email = email;
};

var AttendeeWriteHandler = t.makeWriteHandler({
  tag: function() { return 'att'; },
  rep: function(v) { return t.map([t.keyword('name'), v.name,
                            t.keyword('email'), v.email]); }
});
var writer = t.writer('json', {
  handlers: t.map([
     Attendee, AttendeeWriteHandler
  ])
});

var reader = t.reader('json', {
  handlers: {
    'att': function (rep) { return new Attendee(rep.get(t.keyword('name')),
                                        rep.get(t.keyword('email'))); }
  }
});

var attendees = [
  new Attendee('Filip Zrůst', t.uri('mailto:frzng@me.com')),
  new Attendee('Stojan Jakotyč', t.uri('mailto:sj@example.com'))
];

module.exports = {

  list: function *() {
    this.type = 'application/transit+json';
    this.body = writer.write(attendees);
  },

  index: function *(id) {
    this.type = 'application/transit+json';
    this.body = writer.write(attendees[id]);
  },

  create: function *() {
    var rawBody = yield getRawBody(this.req, {
      length: this.length,
      limit: '1mb',
      encoding: this.request.charset || 'utf8'
    });
    var id = attendees.push(reader.read(rawBody)) - 1;
    console.log('Created:', attendees[id]);

    this.status = 201;
    this.set('Location', '/attendees/' + id);
  },

  update: function *(id) {
    var rawBody = yield getRawBody(this.req, {
      length: this.length,
      limit: '1mb',
      encoding: this.request.charset || 'utf8'
    });
    attendees[id] = reader.read(rawBody);
    console.log('Updated ' + id + ':', attendees[id]);

    this.type = 'application/transit+json';
    this.body = writer.write(attendees[id]);
  },

  db: function(verbose) {
    if (verbose) {
      return t.reader('json-verbose').read(
        t.writer('json-verbose', writer.options).write(attendees)
      );
    } else {
      return JSON.parse(
        t.writer('json', writer.options).write(attendees)
      );
    }
  }

};
