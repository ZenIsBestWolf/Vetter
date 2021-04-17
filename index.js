const Discord = require('discord.js');
const client = new Discord.Client({
	disableMentions: "everyone",
	partials: ['MESSAGE']
});
const prefix = "!"; // old habits die hard sorry mate
const commands = {"veteran": "veteran"} // port old command functionality type thing
const onlyChannel = "832781462432120883"; // Restrict commands to THIS CHANNEL ONLY.
const maxJoinDate = 1609459200000; // 01 Jan 2021 00:00:00 GMT // The latest you could have joined the old server to be eligible.
const oldServer = "681955004298559594"; // The OLD server you are checking for members.
const veteranRole = "833003956065402890"; // The role ID for the veteran role.

client.on('ready', () => {
	console.log("Ready");
});

client.on('message', async message => {
    if (message.partial) await message.fetch(); // Deal with partials
    if (message.channel.id !== onlyChannel) return;
    if (message.author.bot) return;
	if (message.content[0] !== prefix) return;
    let args = message.content.substring(prefix.length).split(" ");
    let command = commands[args[0].toLowerCase()];
    if (command === undefined) return;
    if (command !== "veteran") return;
    let target = message.member;
    let role = message.guild.roles.cache.get(veteranRole);
    let grooving = await client.guilds.fetch(oldServer).then(g => {
        return g;
    });
    let exists;
    let oldMember = undefined;
    try {await grooving.members.fetch(target.id).then(memobj => {
        exists = true;
        oldMember = memobj;
    })};
    catch {exists = false};
    if (!(target.roles.cache.has(veteranRole)) && exists && oldMember.joinedTimestamp < maxJoinDate) {
        target.roles.add(role);
        message.reply("success. Enjoy your role.");
    } else {
        message.reply("either you already have the role, or you weren\'t in the server before 2021. If you believe this is an error, contact an admin.");
    };
});

client.login(process.env.TOKEN);