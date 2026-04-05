const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('results')
    .setDescription('Send tier test results')

    .addStringOption(option =>
      option.setName('ign')
        .setDescription('Player IGN')
        .setRequired(true))

    .addStringOption(option =>
      option.setName('region')
        .setDescription('Region')
        .setRequired(true)
        .addChoices(
          { name: 'EU', value: 'EU' },
          { name: 'NA', value: 'NA' },
          { name: 'AF', value: 'AF' },
          { name: 'ME', value: 'ME' },
          { name: 'AS/AU', value: 'AS/AU' }
        ))

    .addStringOption(option =>
      option.setName('tier_before')
        .setDescription('Tier before')
        .setRequired(true)
        .addChoices(
          { name: 'LT5', value: 'LT5' },
          { name: 'HT5', value: 'HT5' },
          { name: 'LT4', value: 'LT4' },
          { name: 'HT4', value: 'HT4' },
          { name: 'LT3', value: 'LT3' }
        ))

    .addStringOption(option =>
      option.setName('tier_after')
        .setDescription('Tier after')
        .setRequired(true)
        .addChoices(
          { name: 'LT5', value: 'LT5' },
          { name: 'HT5', value: 'HT5' },
          { name: 'LT4', value: 'LT4' },
          { name: 'HT4', value: 'HT4' },
          { name: 'LT3', value: 'LT3' }
        ))

    .addStringOption(option =>
      option.setName('gamemode')
        .setDescription('Gamemode')
        .setRequired(true)
        .addChoices(
          { name: 'Sword', value: 'Sword' },
          { name: 'Axe', value: 'Axe' },
          { name: 'NethPot', value: 'NethPot' },
          { name: 'Mace', value: 'Mace' },
          { name: 'DiaPot', value: 'DiaPot' },
          { name: 'CrystalPvP', value: 'CrystalPvP' },
          { name: 'SpearMace', value: 'SpearMace' }
        ))

    .addUserOption(option =>
      option.setName('tester')
        .setDescription('Tester')
        .setRequired(true))

    .addUserOption(option =>
      option.setName('testeduser')
        .setDescription('Tested user')
        .setRequired(true)),

  async execute(interaction) {

    const ign = interaction.options.getString('ign');
    const region = interaction.options.getString('region');
    const tierBefore = interaction.options.getString('tier_before');
    const tierAfter = interaction.options.getString('tier_after');
    const gamemode = interaction.options.getString('gamemode');
    const tester = interaction.options.getUser('tester');
    const testedUser = interaction.options.getUser('testeduser');

    const embed = new EmbedBuilder()
      .setTitle('Tier Test Results 🏆')
      .setColor(0x2b2d31)
      .setDescription(
`**IGN**
${ign}

**REGION**
${region}

**TIER BEFORE**
${tierBefore}

**TIER AFTER**
${tierAfter}

**GAMEMODE**
${gamemode}

**TESTER**
${tester}`
      );

    await interaction.reply({
      content: `${testedUser}`,
      embeds: [embed]
    });
  }
};
