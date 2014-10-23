var parse = require('co-body');
var t = require("transit-js");

var attendees = [
  t.map([
    t.keyword('name'), 'Filip Zrůst',
    t.keyword('email'), t.uri('mailto:frzng@me.com')
  ]),
  t.map([
    t.keyword('name'), 'Stojan Jakotyč',
    t.keyword('email'), t.uri('mailto:sj@example.com')
  ])
];

module.exports = {

  list: function*() {
    this.type = 'application/transit+json';
    this.body = t.writer().write(attendees);
  },

  index: function*(id) {
    this.type = 'application/transit+json';
    this.body = t.writer().write(attendees[id]);
  },

  create: function*() {
    var id = attendees.push(yield parse(this)) - 1;
    console.log('Created:', attendees[id]);

    this.status = 201;
    this.set('Location', '/attendees/' + id);
  },

  update: function*(id) {
    attendees[id] = yield parse(this);
    console.log('Updated ' + id + ':', attendees[id]);

    this.type = 'application/transit+json';
    this.body = JSON.stringify(attendees[id]);
  },

  db: function(verbose) {
    if (verbose) {
      return t.reader('json-verbose').read(
        t.writer('json-verbose').write(attendees)
      );
    } else {
      return JSON.parse(
        t.writer('json').write(attendees)
      );
    }
  }

};
