const request = require('request-promise-native');
// const request = require('request');

const headers = {
  'Client-Identifier': process.env.CLIENTIDENTIFIER,
  'Client-Name': process.env.CLIENTNAME
};

const osloOptions = {
  baseUrl: 'https://oslobysykkel.no/api/v1/',
  headers: headers,
  json: true
};

const bergenOptions = {
  baseUrl: 'https://gbfs.urbansharing.com/bergenbysykkel.no/',
  headers: headers,
  json: true
};

const trondheimOptions = {
  baseUrl: 'https://gbfs.urbansharing.com/trondheimbysykkel.no/',
  headers: headers,
  json: true
};

function getStations(city) {
  switch (city) {
    case 'oslo':
      return new Promise(osloPromise);
    case 'bergen':
      return new Promise(bergenPromise);
    case 'trondheim':
      return new Promise(trondheimPromise);
    default:
      return Promise.reject(new Error("Unknown city"))
  }
}

function osloPromise(resolve, reject) {
  const promises = [getOsloStations(), getOsloInformation()];
  Promise.all(promises).then(([stations, information]) => {
    const res = stations.stations.map(station => {
      const info = information.stations.find(i => i.id === station.id);
      return mergeOslo(station, info)
    });
    resolve(res);
  }).catch(err => reject(err));
}

function bergenPromise(resolve, reject) {
  const promises = [getBergenStations(), getBergenInformation()];
  Promise.all(promises).then(([stations, information]) => {
    const res = stations.data.stations.map(station => {
      const info = information.data.stations.find(i => i.station_id === station.station_id);
      return mergeGbfs(station, info)
    });
    resolve(res);
  }).catch(err => reject(err));
}

function trondheimPromise(resolve, reject) {
  const promises = [getTrondheimStations(), getTrondheimInformation()];
  Promise.all(promises).then(([stations, information]) => {
    const res = stations.data.stations.map(station => {
      const info = information.data.stations.find(i => i.station_id === station.station_id);
      return mergeGbfs(station, info)
    });
    resolve(res);
  }).catch(err => reject(err));
}

function getOsloStations() {
  const tempOptions = Object.assign({}, osloOptions)
  tempOptions.uri = 'stations';
  return request(tempOptions);
}


function getBergenStations() {
  const tempOptions = Object.assign({}, bergenOptions)
  tempOptions.uri = 'station_information.json';
  return request(tempOptions);
}

function getTrondheimStations() {
  const tempOptions = Object.assign({}, trondheimOptions)
  tempOptions.uri = 'station_information.json';
  return request(tempOptions);
}

function getOsloInformation() {
  const tempOptions = Object.assign({}, osloOptions);
  tempOptions.uri = 'stations/availability';
  return request(tempOptions);
}

function getBergenInformation() {
  const tempOptions = Object.assign({}, bergenOptions);
  tempOptions.uri = 'station_status.json';
  return request(tempOptions);
}

function getTrondheimInformation() {
  const tempOptions = Object.assign({}, trondheimOptions);
  tempOptions.uri = 'station_status.json';
  return request(tempOptions);
}

function mergeOslo(s, i) {
  return {
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    lat: s.center.latitude,
    lon: s.center.longitude,
    locks: i.availability.locks,
    bikes: i.availability.bikes
  }
}

function mergeGbfs(s, i) {
  return {
    id: s.station_id,
    title: s.name,
    subtitle: s.address,
    lat: s.lat,
    lon: s.lon,
    locks: i.num_docks_available,
    bikes: i.num_bikes_available
  }
}

module.exports.getStations = getStations;