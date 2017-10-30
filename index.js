const fs = require('fs');
const Discord = require('discord.js');
const pkg = require('./package.json');

const client = new Discord.Client();

function readConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile('./config.json', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  })
    .then(JSON.parse);
}

function writeConfig(conf) {
  return new Promise((resolve, reject) => {
    fs.writeFile('./config.json', JSON.stringify(conf, null, 2), (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

readConfig()
  .then((config) => {
    client.login(config.token);
  }, (err) => {
    console.error('unable to read config');
    console.error(err);
  });
