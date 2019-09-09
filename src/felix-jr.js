const tokens = require("./json/tokens.json"), config = require("./json/config.json"), prefix = config.prefix;
const fs = require("fs"), random = require("drbracewell-random-tools")

const Discord = require('discord.js'), discordClient = new Discord.Client();
discordClient.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands')

for (const file of commandFiles) {
	let command = require(`./commands/${file}`);
	discordClient.commands.set(command.name, command);
}

discordClient.on('ready', () => {
    console.log('Starting Felix Jr.');
    discordClient.user.setActivity("Inside jokes since '81");
  });

setInterval(() => {
    let num = random.randomBetween(0, 1000);
    if (num === 1) {
        discordClient.guilds.get("612778224887267342").channels.get("618186163353813019").send(random.randomFromArray(config.jokes))
    }
}, 1000)

discordClient.on('guildMemberAdd', member => {
  member.guild.channels.get('612778224887267344').send(`Welcome <@${member.id}>! Check out <#612813188077191199>. When you're ready, post in <#612779316438237211> and <#612800612752424961>. Have any questions? Ask around or tag a mod, and let a mod (name in purple writing) know if you have pronouns you want added to your name or a colour. Enjoy!`); 
});

discordClient.on('message', message => {
  // Test
  if (message.content.toLowerCase() === `${prefix}ping`) {
    message.channel.send("Pong!")
    message.channel.send(`${message.author}`)
  }

    if (!message.author.bot && message.channel.id == "618186163353813019") {
        if (message.content.toLowerCase().includes("vitamin")) {
            message.channel.send("What the FUCK is a vitamin.")
        } if (message.content.toLowerCase().includes("autocorrect")) {
            message.channel.send("*autocarrot")
        } if (message.content.toLowerCase().includes("valid")) {
            message.channel.send("*vaeleed")
        } if (message.content.toLowerCase().includes("tree")) {
            message.channel.send("I am the Lorax I speak for the trees, save the Amazon or I’ll break your knees.")
        } if (message.content.toLowerCase().includes("drug")) {
            message.channel.send("*DRUGS* ARI NO")
        } if (message.content.toLowerCase().includes("luranixl")) {
          message.channel.send("***TRIPPY SEXY GODDESSES***")
        } if (message.content.toLowerCase().includes("blood") && message.content.toLowerCase().includes("cookie")) {
          message.channel.send("\"No Grey, blood does *not* make the cookies taste better.\"")
        } if (message.content.toLowerCase().includes("leo")) {
          message.channel.send("*absolute sweetheart")
        } if (message.content.toLowerCase().includes("merlin")) {
          message.channel.send("*baby wizard")
        } if (message.content.toLowerCase().includes("felix jr")) {
          message.channel.send("That's Me!")
        } if (message.content.toLowerCase().includes("bastard")) {
          message.channel.send("*chaptic bastard*")
        } if (message.content.toLowerCase().includes("spaghetti")) {
          message.channel.send("**SPAGHETTI ROMANCE**")
        }
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
    let command = args.shift().toLowerCase();
    if (!discordClient.commands.has(command)) return;

    try {
      discordClient.commands.get(command).execute(message, args, Discord);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
    }
});

discordClient.login(tokens.discord);