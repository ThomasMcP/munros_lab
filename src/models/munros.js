const PubSub = require('../helpers/pub_sub.js');
const RequestHelper = require('../helpers/request_helper.js');

const Munros = function () {
  this.munrosData = [];
  this.regions = [];
}

Munros.prototype.getData = function () {
  const request = new RequestHelper('https://munroapi.herokuapp.com/api/munros');
  request.get()
  .then((data) => {
    this.munrosData = data;
    this.regions = this.uniqueRegions(data);
    PubSub.publish('Munros:munros-ready', this.munrosData);
    PubSub.publish('Munros:regions-ready', this.regions);
  });
}

Munros.prototype.uniqueRegions = function (munros) {
  const allRegions = this.munrosData.map(munro => munro.region);
  return allRegions.filter((region, index, array) => {
    return array.indexOf(region) === index;
  });
}
