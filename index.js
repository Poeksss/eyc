const discord = require("discord.js");
const client = new discord.Client();
const fs = require('fs');
const moment = require('moment');

let userData =  JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

client.on("ready", ready => {
    console.log('ready!');
});

client.on("guildMemberAdd", async a => {
    const channel = client.channels.get('572405649678401536');

    var role = a.guild.roles.find(r => r.name === "member");

    const jEmbed = new discord.RichEmbed()
    .setTitle('🎉welcome🎉')
    .addField('name:', a.displayName, true)
    .addField('invited by:', inviter)
    .setColor('#42f459');

    await channel.send(jEmbed);
    a.setNickname(`<🍬>${a.displayName}`);
    a.addRole(role);
});

client.on('message', async message => {
    //variables
    let sender = message.author;
    let msg = message.content.toUpperCase();
    let prefix = '>'

    if (client.user.id === message.author.id) { return }

    //events
    let userData =  JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

    if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
    if (!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 1000;
    if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = 'not collected';

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if(err) console.error(err);
    });
    //commands

    //ping

    //money [acces balance]
    if (msg === prefix + 'MONEY' || msg === prefix + 'BALANCE'){
        message.channel.send({"embed":{
            title:"Bank",
            color: 0x61ed6c,
            fields:[{
                name:"Account Holder",
                value:message.author.username,
                inline:true
            },
            {
                name:"Account Balance",
                value:userData[sender.id + message.guild.id].money + "🍬",
                inline:true
            }]
        }});
    }

    //daily
    if (msg === prefix + 'DAILY'){
        if (userData[sender.id + message.guild.id].lastDaily != moment().format('L')) {
            userData[sender.id + message.guild.id].lastDaily = moment().format('L')
            userData[sender.id + message.guild.id].money += 500;

            message.channel.send({"embed":{
                title:"daily reward",
                description:"you got 500🍬 added to your account!",
                color: 0x61ed6c

            }})
        } else {
            message.channel.send({"embed":{
                title:"daily reward",
                description:"you already claimed your daily reward! :no_entry_sign:",
                color: 0xff0000,
                fields:[{
                    name:"next daily",
                    value:moment().endOf('day').fromNow()
                }]
            }});
        }
    }


    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if(err) console.error(err);
    });


});




client.login(process.env.token);