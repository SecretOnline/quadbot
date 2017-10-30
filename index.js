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

client.on('message', (msg) => {
  // Only accept messages in servers (i.e. not PMs)
  if (!msg.guild) {
    return;
  }


  const match = msg.content.match(/(?:^|\W)(thank(s| you)?|thx|ty)(?:$|\W)/i);
  if (!match) {
    return;
  }

  console.log(`> ${msg.author.username}: ${msg.content}`);

  readConfig()
    .then((config) => {
      const user = client.users.get(config.uid);
      if (!user) {
        console.error(`couldn't find user ${config.uid}`);
        return;
      }

      user.send(`${msg.author} said "${match[1]}" in ${msg.channel}`);
    });
});

readConfig()
  .then((config) => {
    client.login(config.token);
  }, (err) => {
    console.error('unable to read config');
    console.error(err);
  });
