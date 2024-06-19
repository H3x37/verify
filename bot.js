const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder, REST, Routes, InteractionType } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const token = ''; // Replace with your bot token
const clientId = ''; // Replace with your bot's client ID
const guildId = ''; // Replace with your server's guild ID
const verificationChannelId = ''; // Replace with your verification channel ID
const verifiedRoleId = ''; // Replace with your verified role ID

// Register slash command
const commands = [
    new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Sends a verification button.')
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.commandName === 'verify') {
            const verifyButton = new ButtonBuilder()
                .setCustomId('verify')
                .setLabel('Verify')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder()
                .addComponents(verifyButton);

            await interaction.reply({
                content: 'Click the button below to verify your account.',
                components: [row],
                ephemeral: true
            });
        }
    } else if (interaction.type === InteractionType.MessageComponent) {
        if (interaction.customId === 'verify') {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (member) {
                await member.roles.add(verifiedRoleId);
                await interaction.reply({ content: 'You have been verified!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Member not found!', ephemeral: true });
            }
        }
    }
});

client.login(token);