const tokens = require("./tokens.json"), config = require("./config.json"), prefix = config.prefix
const Discord = require('discord.js'), discordClient = new Discord.Client(), random = require("drbracewell-random-tools"), fetch = require("node-fetch")

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
  member.guild.channels.get('612778224887267344').send(`Welcome <!${member.id}>! Check out <#612813188077191199>. When you're ready, post in <#612779316438237211> and <#612800612752424961>. Have any questions? Ask around or tag a mod, and let a mod (name in purple writing) know if you have pronouns you want added to your name or a colour. Enjoy!`); 
});

discordClient.on('message', message => {
    if (message.content.toLowerCase() === `${prefix}ping`) {
        message.channel.send("Pong!")
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

    let args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
    let command = args.shift().toLowerCase();

    if (command === `trivia` && message.channel.id == "618186163353813019") {

        if (args.length == 0) {
          message.channel.send("Please provide a difficulty, `easy`, `medium` or `hard`.");
          return;
         }

        // Setup
        let questionNumber = 0, contestants = [], questionEmbed, randomQuestion = {}, randomChoices = [], 
            shuffledAnswer = 0, choicesString = ``, leaderboard = [], list = [], url = "https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986";

        
          if(args.length === 2) {
            switch (args[0]) {
              case "easy":
                url += "&difficulty=easy";
                break;
              case "medium":
                  url += "&difficulty=medium";
                  break;
              case "hard":
                  url += "&difficulty=hard";
                  break;
            }
          }
            // Get api trivia
          fetch(url)
            .then(res => res.json())
            .then(res => {
              questionsArray = res.results.slice();

              for (let element of questionsArray) {
                element.question = decodeURIComponent(element.question);
                element.incorrect_answers.unshift(element.correct_answer);
                for (i = 0; i < element.incorrect_answers.length; i++) {
                  element.incorrect_answers[i] = decodeURIComponent(element.incorrect_answers[i]);
                };
                let obj = element;
                obj.answers = obj.incorrect_answers;
                delete obj.incorrect_answers;
              }

            })
            .catch(function (error) {
              console.log(error);
              message.channel.send("Something went when trying to recieve the questions from the API, please try again.");
              return;
            });
        
        // incorrect/correct answers
        let correctAnswers = () => {
          if (leaderboard.some(element => element.correct === true)) {
            list = [];
            leaderboard.forEach(element => {
              if (element.correct === true) {
                list.push(element.id);
              }
            })
            return `<@${list.join(">, <@")}> answered the question correctly.`;
          } else return "No one answered the question correctly."
        }
        let incorrectAnswers = () => {
          if (leaderboard.some(element => element.correct === false)) {
            list = [];
            leaderboard.forEach(element => {
              if (element.correct === false) { 
                list.push(element.id);
              }
            })
            return `<@${list.join(">, <@")}> did not answer the question correctly.`;
          } else return "No one answered the question incorrectly.";
        }
    
        // sort leaderboard
        let sortContestants = () => {
          let orderedBoard = leaderboard.slice();
          let returnString = "";
          let number = 0;
          orderedBoard.sort((a, b) => b.score - a.score)
          for (i = 0; i < orderedBoard.length; i++) {
            number++;
            returnString += `${number}) <@${orderedBoard[i].id}> with **${orderedBoard[i].score}** points.\n`;
          }
          return returnString;
        }
    
        // Question Generator
        function questions() {
          // Question Template
          questionNumber++;
          questionEmbed = new Discord.RichEmbed()
            .setColor(random.randomColour())
            .setAuthor("Felix Jr.")
            .setTitle(`**Question ${questionNumber}**:`);
    
          // Question Generation + Shuffling
          leaderboard.forEach((element) => {
            element.correct = false;
          })
    
          // Duplicate question + inject
          randomQuestion = random.randomFromArray(questionsArray);
          randomChoices = randomQuestion.answers.slice().sort(() => Math.random() - 0.5);
          shuffledAnswer = randomChoices.indexOf(randomQuestion.answers[0]);
          shuffledAnswer === 0 ? shuffledAnswer = "🇦" : 
            shuffledAnswer === 1 ? shuffledAnswer = "🇧" :
            shuffledAnswer === 2 ? shuffledAnswer = "🇨" :
            shuffledAnswer === 3 ? shuffledAnswer = "🇩" :
              null;
          choicesString = `A) ${randomChoices[0]} \nB) ${randomChoices[1]} \nC) ${randomChoices[2]} \nD) ${randomChoices[3]}`;
    
          // Embed in question.
          questionEmbed.addField(randomQuestion.question, "React to this message with your answer!").addField("Choices:", choicesString);
          questionsArray.splice(questionsArray.indexOf(randomQuestion), 1);
    
          // Send + React
          message.channel.send(questionEmbed).then(message => {
            let abcd = ["🇦", "🇧", "🇨", "🇩"];
            
            message.react(abcd[0])
              .then(m => message.react(abcd[1]))
              .then(m => message.react(abcd[2]))
              .then(m => message.react(abcd[3]))
              .then(m => message.channel.send("You have 15 seconds to answer the question!"))
              .then(m => {
                // Listen for reactions
                let filter = (reaction, user) => abcd.includes(reaction.emoji.name) && !user.bot;
                let collector = message.createReactionCollector(filter, { time: 15000 });
                let alreadyReacted = [];
                collector.on("collect", reaction => {
                  // If contestant + not reacted continue
                  if (contestants.includes(reaction.users.keyArray().splice(-1, 1)[0]) && !alreadyReacted.includes(reaction.users.last().id)) {
                    for (i = 0;i < leaderboard.length; i++) {
                      if (leaderboard[i].id === reaction.users.last().id  && reaction.emoji.name == shuffledAnswer) {
                        leaderboard[i].score += 1;
                        leaderboard[i].correct = true;
                      }
                    }
                    alreadyReacted.push(reaction.users.last().id);
                  } else {
                    // remove emoji
                    switch (reaction.emoji.name) {
                      case abcd[0]:
                        message.reactions.get(abcd[0]).remove(reaction.users.last());
                        break;
    
                      case abcd[1]:
                        message.reactions.get(abcd[1]).remove(reaction.users.last());
                        break;
                    
                      case abcd[2]:
                        message.reactions.get(abcd[2]).remove(reaction.users.last());
                        break;
                      
                      case abcd[3]:
                        message.reactions.get(abcd[3]).remove(reaction.users.last());
                        break;
                    }
                  }
                })
                // On end send answer
                collector.on("end", reaction => {
                  message.channel.send(`${correctAnswers()}\n${incorrectAnswers()}`);
                  message.channel.send(`The correct answer was ${shuffledAnswer}, ${randomQuestion.answers[0]}`);
                  // If finish send leaderboard.
                  if (questionNumber === 5) {
                    setTimeout(() => {
                      message.channel.send(
                        new Discord.RichEmbed()
                        .setColor("#1a8892")
                        .setAuthor("Felix Jr.")
                        .setTitle(`**Contest Results**`)
                        .setDescription("Thanks for participating!")
                        .setFooter("Use $trivia to start another contest.")
                        .setTimestamp()
                        .addField("Leaderboard:", sortContestants())
                      );
                    }, 5000)
                  } else {
                    // Next question
                    setTimeout(() => {
                      questions();
                    }, 3000)
                  }
                })
              })
          });
        };
    
        // Message Detection
        try {
          message.channel.send(`${message.author} has started a __${(args[0] === "general") ? `${args[1].toUpperCase()} ` : ''}${args[0].toUpperCase()} TRIVIA CONTEST__! React to this message to join in. The contest will start in 20 seconds, or disband if there are not enough players.`).then(message => {
            message.react("❓");
            let filter = (reaction, user) => reaction.emoji.name === '❓' && !user.bot;
            // Player collection
            message.awaitReactions(filter, { time: 20000 })
              .then(collected => {
                if (collected.get("❓").count >= 3) {
                  // Set up contestants + leaderboard and start 1st question
                  contestants = collected.get("❓").users.keyArray();
                  contestants.shift();
                  message.channel.send(`Contest has started! The contestants are: <@${contestants.join(">, <@")}>!`);
                  message.channel.send(`**Please do not react to questions until the '15 seconds' message has been sent!**`);
                  for (i=0; i < contestants.length; i++) {
                    leaderboard.push({
                      "id": contestants[i],
                      "score": 0,
                      "correct": false
                    });
                  }
                  questions();
                } else {
                  // Not enough players
                  message.channel.send(`The contest has been disbanded because there weren't enough players!`);
                }
              })
              .catch(console.error);
          });
        }
        catch (err) {
          console.log(err);
          message.channel.send(`Something went wrong, please try again!`);
        }
    }
});

discordClient.login(tokens.discord);