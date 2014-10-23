var parse = require('co-body');

var attendees = [];

module.exports = {

  list: function*() {
    this.type = 'application/json';
    this.body = JSON.stringify(attendees);
  },

  index: function*(id) {
    this.type = 'application/json';
    this.body = JSON.stringify(attendees[id]);
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

    this.type = 'application/json';
    this.body = JSON.stringify(attendees[id]);
  }

};
