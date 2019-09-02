const tokens = require("./tokens.json");
const Discord = require('discord.js'), discordClient = new Discord.Client();

discordClient.on('ready', () => {
    console.log('Starting Felix Jr.');
    discordClient.user.setActivity("Inside jokes since '81");
  });

discordClient.on('message', message => {
    if (message.content.toLowerCase() === `$ping`) {
        message.channel.send("Pong!")
    }
    if (message.content.toLowerCase().includes("vitamin") && !message.author.bot) {
        message.channel.send("What the FUCK is a vitamin.")
    }
    if (message.content.toLowerCase().includes("valid") && !message.author.bot) {
        message.channel.send("*vaeleed")
    }
    if (!message.author.bot) {
        message.channel.send("F")
    }
})
discordClient.login(tokens.discord);