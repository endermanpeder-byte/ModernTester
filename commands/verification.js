const { 
    Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST,
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
    ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType
} = require('discord.js');

const TOKEN = 'MTQ3MjcyMTk3MjQ0OTI0NzI4NQ.GF0VMt.JLuF2Jiq7L-ztv5sYTojQMjgnXAovC3az9eOT0';
const CLIENT_ID = '1472721972449247285';
const GUILD_ID = '1379128107428085855';
const VERIFIED_ROLE_ID = '1379896969333440694';
const TARGET_CHANNEL_ID = '1379845516355043368';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// --- Register slash command ---
const commands = [
    new SlashCommandBuilder()
        .setName('verification')
        .setDescription('Sends the Evaluation Testing Waitlist embed')
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('Slash commands registered!');
    } catch (err) {
        console.error(err);
    }
})();

// --- Bot logic ---
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {

    // Slash command
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'verification') {
            const embed = new EmbedBuilder()
                .setTitle('📃 Evaluation Testing Waitlist')
                .setDescription(
`Upon applying, you will be added to a waitlist channel. You will be pinged when a tester is available. If you are HT3 or higher, a high test ticket will be created.
You can take a re-test every 2 days
For a High Test you can re-test every 4 days

Region should be the region of the server you wish to test on.
Username should be the name of the account you will be testing on.

🛑 Failure to provide authentic information will result in a denied test.
⛔ Testing sooner than 2 days will result in denied test.`
                )
                .setColor('#00FFFF');

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('verify_account')
                        .setLabel('Verify account')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('ht3_test')
                        .setLabel('HT3+ test')
                        .setStyle(ButtonStyle.Secondary)
                );

            const channel = await client.channels.fetch(TARGET_CHANNEL_ID);
            if (channel) {
                await channel.send({ embeds: [embed], components: [buttons] });
                await interaction.reply({ content: '✅ Verification embed sent!', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Could not find the target channel.', ephemeral: true });
            }
        }
    }

    // Button interactions
    if (interaction.isButton()) {
        if (interaction.customId === 'verify_account') {
            const modal = new ModalBuilder()
                .setCustomId('verify_modal')
                .setTitle('Verify Account');

            const ignInput = new TextInputBuilder()
                .setCustomId('ign')
                .setLabel("You're in-game username")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const regionInput = new TextInputBuilder()
                .setCustomId('region')
                .setLabel('Region (EU/NA/AS/ME/AF/AU)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row1 = new ActionRowBuilder().addComponents(ignInput);
            const row2 = new ActionRowBuilder().addComponents(regionInput);

            modal.addComponents(row1, row2);

            await interaction.showModal(modal);
        }
    }

    // Modal submission
    if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId === 'verify_modal') {
            const ign = interaction.fields.getTextInputValue('ign');
            const region = interaction.fields.getTextInputValue('region');

            const member = await interaction.guild.members.fetch(interaction.user.id);
            await member.roles.add(VERIFIED_ROLE_ID);

            await interaction.reply({
                content: `✅ Your account has been verified!\n**IGN:** ${ign}\n**Region:** ${region}`,
                ephemeral: true
            });

            // Optional: log to console or save to a database
            console.log(`${interaction.user.tag} verified with IGN: ${ign}, Region: ${region}`);
        }
    }
});

client.login(TOKEN);
