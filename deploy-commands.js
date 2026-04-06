const { REST, Routes } = require('discord.js');
const fs = require('fs');

const token = process.env.TOKEN; // Your bot token
const clientId = '1472721972449247285';
const guildId = '1384933716736086026'; // Replace with your server ID

const commands = [];

// Read all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
