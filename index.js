var parse = require('co-body');
var t = require("transit-js");

var Attendee = function(name, email) {
  this.name = name;
  this.email = email;
};
var AttendeeHandler = t.makeWriteHandler({
  tag: function() { return 'att'; },
  rep: function(v) { return t.map([t.keyword('name'), v.name,
                            t.keyword('email'), v.email]); }
});

var writer = t.writer('json', {
  handlers: t.map([
     Attendee, AttendeeHandler
  ])
});

var attendees = [
  new Attendee('Filip Zrůst', t.uri('mailto:frzng@me.com')),
  new Attendee('Stojan Jakotyč', t.uri('mailto:sj@example.com'))
];

module.exports = {

  list: function*() {
    this.type = 'application/transit+json';
    this.body = writer.write(attendees);
  },

  index: function*(id) {
    this.type = 'application/transit+json';
    this.body = writer.write(attendees[id]);
  },

  create: function*() {
    var data = yield parse(this);
    var id = attendees.push(new Attendee(
      data.name, data.email
    )) - 1;
    console.log('Created:', attendees[id]);

    this.status = 201;
    this.set('Location', '/attendees/' + id);
  },

  update: function*(id) {
    var data = yield parse(this);
    attendees[id] = new Attendee(
      data.name, data.email
    );
    console.log('Updated ' + id + ':', attendees[id]);

    this.type = 'application/transit+json';
    this.body = JSON.stringify(attendees[id]);
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
