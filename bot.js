const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const ms = require("ms");
const ddiff = require("return-deep-diff");
const superagent = require("superagent");
const Twitter = require("twitter");
const random = require("random-animal");
const jsonfile = require("jsonfile");
const fs = require("fs");
const package = JSON.parse(fs.readFileSync("./package.json"));
const config = JSON.parse(fs.readFileSync("./settings.json"));
const snek = require("node-superfetch");
const antispam = require("discord-anti-spam");
const relevant = require("relevant-animals");
const phrases = JSON.parse(fs.readFileSync("./forbiddenphrases.json", "utf-8"));


var version = package.version;
var owner = package.author;
var desc = package.description;


const pre = config.prefix;
const token = config.token

var bot = new Discord.Client();


bot.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). Guild members: ${guild.memberCount}`)
    console.log(`Servers: ${bot.guilds.size}\n Users: ${bot.users.size}`)
    bot.user.setPresence({game: {name: `${pre}cmds || Users: ${bot.users.size}`, type:0}});
});

bot.on("guildDelete", guild => {
    console.log(`Bot removed from: ${guild.name} (id: ${guild.id})`)
    console.log(`Bot online. Servers: ${bot.guilds.size}`)
    bot.user.setPresence({game: {name: `${pre}cmds || Users: ${bot.users.size}`, type:0}});
});

bot.on("ready", () => {
    console.log(`Bot online. Servers: ${bot.guilds.size}`);


    bot.user.setPresence({game: {name: `${pre}peta-help for cmds || Users: ${bot.users.size}`, type:0}});

    antispam(bot, {
  warnBuffer: 3, //Maximum amount of messages allowed to send in the interval time before getting warned.
  maxBuffer: 11, // Maximum amount of messages allowed to send in the interval time before getting banned.
  interval: 1000, // Amount of time in ms users can send a maximum of the maxBuffer variable before getting banned.
  warningMessage: "stop spamming or I'll whack your head off.", // Warning message send to the user indicating they are going to fast.
  banMessage: "has been banned for spamming, anyone else?", // Ban message, always tags the banned user in front of it.
  maxDuplicatesWarning: 7,// Maximum amount of duplicate messages a user can send in a timespan before getting warned
  maxDuplicatesBan: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting banned
  deleteMessagesAfterBanForPastDays: 7 // Delete the spammed messages after banning for the past x days.
});
});


bot.on("message", async (message) => {

    if (message.content === "no u") {
      message.reply("yes me :thinking:")
    }

    if (message.content === "i eat meat") {

    }

    /*if (message.content.startsWith("discord.gg" || "https://discord.gg")) {
      var serverInvite = "discord.gg/aFcASYS"
      message.delete().then(() => {
        message.reply(`Please do not post other discord server links\nInstead use this: ${serverInvite}`)
      })
    }*/

    let args1 = message.content.split(" ").slice(1);
    var result = args1.join(" ");

    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(pre)) return;


    var args = message.content.substring(pre.length).split(" ");

    switch (args[0].toLowerCase()) {
    /*  case "addphrase":
        var logg = message.guild.channels.find("name", "log");
        if(!logg) return message.reply("No channel named log, please create one!") ;
        var phrase = args.join(" ").slice(22);
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You don't have the permissions to do that!");

        fs.writeFile("./forbiddenphrases.json", JSON.stringify(phrases), (err) => {
          if (err) console.log(err);
        });

        var phraseEmb = new Discord.RichEmbed()
        .setDescription("New Banned Phrase")
        .setColor("#0d83c6")
        .addField("Phrase", phrase)
        .setFooter(`Phrase submitted by: ${message.author.username}`, `${message.author.avatarURL}`);
        logg.send({embed: phraseEmb});
        break;*/
      case "peta-report":
        var rUser = args[1] || message.guild.member(message.mentions.users.first());
        if(!rUser) return message.reply("Please specify a person");
        var reasonV = args.join(" ").slice(22);

        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Report")
        .setColor("#15f153")
        .addField("Reported Person", `${rUser}`)
        .addField("Reported by", `${message.author}`)
        .addField("Channel", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", reasonV);

        let reportChannel = message.guild.channels.find("name", "reports");
        reportChannel.send({embed: reportEmbed});
        break;
      case "peta-link":
        var petaEmbed = new Discord.RichEmbed()
        .setColor("#75aaff")
        .setTitle("Peta Chatline Links")
        .addField("Youtube", "[Youtube Link](https://www.youtube.com/channel/UCeASRYMVnJe-UB_L0E8Wijw)")
        .addField("Twitch", "[Twitch Link](https://twitch.tv/petachatlineofficial)")
        .addField("Twitter", "[Twitter Link](https://twitter.com/petachatline)")
        .setFooter("PETA CHATLINE 2018");
        message.channel.send({embed: petaEmbed});
        break;
      case "peta-god":
        var god = "http://a57.foxnews.com/media2.foxnews.com/2015/07/29/640/360/Colmes_IngridNewkirk_072915.jpg";
        var ingEmbed = new Discord.RichEmbed()
        //  .setThumbnail(god)
          .setImage(god)
          .setColor("#75aaff")
          .setTitle("Ingrid Newkirk")
          .setFooter("PETA");
          message.channel.send({embed: ingEmbed});
          break;
      case "ban":
        let lllog = message.guild.channels.find("name", "log")
        if(!lllog) return message.reply("Can't find a channel named log");
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.reply("Can't find user!");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You don't have the permissions to do that!");
        if(bUser.hasPermission("ADMINISTRATOR")) return message.reply("They can't be abnned!");
        let bEmbed = new Discord.RichEmbed()
        .setDescription("Ban")
        .setColor("#0d83c6")
        .addField("Banned User", `${bUser}, ID:${bUser.id}`)
        .addField("Banned By", `<@${message.author.id}> ID:${message.author.id}`)
        .addField("Reason", bReason)
        .setTimestamp()
        message.guild.member(bUser).ban(bReason);
        lllog.send({embed: bEmbed});
        break;
      case "kick":
          let llog = message.guild.channels.find("name", "log")
          if(!llog) return message.reply("Can't find a channel named log");
          let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
          if(!kUser) return message.reply("Can't find user!");
          let kReason = args.join(" ").slice(22);
          if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have the permissions to do that!");
          if(kUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They can't be kicked!");
          let kEmbed = new Discord.RichEmbed()
          .setDescription("~Kick~")
          .setColor("#e56b00")
          .addField("Kicked User", `${kUser}, ID:${kUser.id}`)
          .addField("Kicked By", `<@${message.author.id}> ID:${message.author.id}`)
          .addField("Reason", kReason)
          .setTimestamp()
          message.guild.member(kUser).kick(kReason);
          llog.send({embed: kEmbed});
          break;
      case "unmute":
          let log3 = message.guild.channels.find("name", "log");
          let user3 = message.mentions.members.first();
          let user4 = message.mentions.users.first();
          let mRole4 = message.guild.roles.find("name", "Muted");
          if(!mRole4) return message.reply("You do not have a role named Muted");
          if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permissions to do that!");
          if(!log3) return message.reply("Please have a channel named #log");
          if(message.mentions.users.size < 1) return message.reply("Please specify a user").catch(console.error);
          let Umbed = new Discord.RichEmbed()
            .setTitle("UnMute")
            .setColor("#c6230d")
            .setTimestamp()
            .addField("UnMuted User", `${user4.username}#${user4.discriminator}`)
            .addField("Moderator", `${message.author.username}#${message.author.discriminator}`);
          user3.removeRole(mRole4);
          log3.send({embed: Umbed});
        break;
      case "mute":
          let log2 = message.guild.channels.find("name", "log");
          let reason2 = args.slice(2).join(" ");
          let user = message.mentions.members.first();
          let user2 = message.mentions.users.first();
          let mRole = message.guild.roles.find("name", "Muted");
          if(!mRole) return message.reply("You do not have a role named Muted");
          if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permissions to do that!");
          if(!log2) return message.reply("Please have a channel named #log");
          if(!reason2) return message.reply("Please specify a reason");
          if(message.mentions.users.size < 1) return message.reply("Please specify a user").catch(console.error);
          let Mmbed = new Discord.RichEmbed()
            .setTitle("Mute")
            .setColor("#c6230d")
            .setTimestamp()
            .addField("Reason", reason2)
            .addField("Muted User", `${user2.username}#${user2.discriminator}`)
            .addField("Moderator", `${message.author.username}#${message.author.discriminator}`);
          user.addRole(mRole);
          log2.send({embed: Mmbed});
        break;
        case "warn":
          let log = message.guild.channels.find("name", "log");
          let reason = args.slice(2).join(" ");
          let user56 = message.mentions.users.first();
          if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permissions to do that!");
          if(!log) return message.reply("Please have a channel named #log");
          if(!reason) return message.reply("Please specify a reason");
          if(message.mentions.users.size < 1) return message.reply("Please specify a user").catch(console.error);
          let Wembed = new Discord.RichEmbed()
          .setTitle("Warning")
          .setColor("#f45342")
          .setTimestamp()
          .addField("Reason", reason)
          .addField("Warned User", `${user56.username}#${user56.discriminator}`)
          .addField("Moderator", `${message.author.username}#${message.author.discriminator}`)
          log.send({embed: Wembed});
          break;
      case "peta-poll":
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("You don't have the permissions to do that!");
        let question = args.slice(1).join(" ");

          if (args.length === 0)
          return message.reply('**Invalid Format:** `!Poll <Question>`');

          let pollembed = new Discord.RichEmbed()
          .setTitle("A Poll Has Been Started!")
          .setColor("#5599ff")
          .setDescription(`${question}`)
          .setFooter(`Poll Started By: ${message.author.username}`, `${message.author.avatarURL}`);

          message.channel.send({embed: pollembed}).then(embedMessage => {
              embedMessage.react('👍')
              embedMessage.react('👎')
              message.delete(1000)
          })

          .catch(() => console.error('Emoji failed to react.'));
        break;
      case "peta-dog":
          random.dog().then(url => {
            var dogEmbed = new Discord.RichEmbed()
            .setImage(url)
            .setTitle("Peta Dog")
            .setColor("RANDOM")
            .setFooter("Courtesy of Peta");
            message.channel.send({embed: dogEmbed})
          });
          break;
      case "peta-cat":
        var api = "http://aws.random.cat/meow";
        var file = (await snek.get(api)).body.file;
        if(!file) return message.reply("oops. you broke me!");
        var catEmbed = new Discord.RichEmbed()
        .setImage(file)
        .setTitle("Peta Cat")
        .setColor("RANDOM")
        .setFooter("Courtesy of Peta");
        message.channel.send({embed: catEmbed})
        break;
      case "peta-info":
          var image = "https://pbs.twimg.com/profile_images/1022106601287647232/PaLyPgbm.jpg"
          var petaEmbed = new Discord.RichEmbed()
          .setImage(image)
          .setTitle("People for the Ethical Treatment of Animals")
          .addField("PETA Website", "[Link](https://www.peta.org/)")
          .setColor("#75aaff")
          .setDescription("PETA focuses its attention on the four areas in which the largest numbers of animals suffer the most intensely for the longest periods of time: in the food industry, in the clothing trade, in laboratories, and in the entertainment industry. We also work on a variety of other issues, including the cruel killing of rodents, birds, and other animals who are often considered “pests” as well as cruelty to domesticated animals.")
          .setFooter("PETA 2018");
          message.channel.send({embed: petaEmbed});
          break;
      case "usercount":
            let guildC = message.guild
            var count = new Number(guildC.memberCount)
            message.reply(`There are **${count}** users in this server.`)
            break;
      case "userinfo":
          let oof = message.mentions.members.first() || message.author;
          let tagger = message.mentions.users.first() || message.author;
            var useri = new Discord.RichEmbed()
            .setAuthor(tagger.username)
            .setDescription("User Info")
            .setColor("RANDOM")
            .addField("Username", tagger.tag)
            .addField("ID", tagger.id)
            .addField("Account registered", tagger.createdAt)
            .setThumbnail(tagger.displayAvatarURL)
            message.channel.send({embed: useri});
            break;
      case "peta-help":
            var cmd = new Discord.RichEmbed()
            .addField("All Commands", "peta-god\npeta-dog\npeta-info\npeta-link\npeta-cat\npeta-report\nbotinfo")
            .addField("Admin Commands", "Ban\nKick\nMute\nunMute\npeta-poll\nPurge")
            .setTitle("The list of commands for Peta Chatline")
            .setTimestamp()
            .setColor("#75aaff")
            message.channel.send({embed: cmd});
            break;
      case "botinfo":
            var info = new Discord.RichEmbed()
            .setTitle("Peta Chatline info")
            .addField("Description", desc)
            .addField("Developer", owner)
            .addField("Version", version)
            .addField("Created on", bot.user.createdAt)
            .setThumbnail(bot.user.displayAvatarURL)
            .setTimestamp()
            .setColor("#49ffa4")
            message.channel.send({embed: info});
            break;
      case "purge":
            message.delete();
            let amnt = args.slice(1).join(" ");
            if(!amnt) return message.reply("Please specify a number!");
            if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, you don't have the permissions for that!");
            const fetched = await message.channel.fetchMessages({limit: amnt});
            message.channel.bulkDelete(fetched).then(() => {
              message.channel.send(`Deleted ${fetched.size} messages.`).then(msg => msg.delete(3000));
            });
            break;
        default:
            message.reply("Invalid command.");
    }
});

bot.login(token)
