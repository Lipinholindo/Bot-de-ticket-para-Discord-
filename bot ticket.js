const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const prefix = '!';
const ticketCategoryName = 'Tickets';

client.once('ready', () => {
    console.log('Bot está online!');
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ticket') {
        const ticketChannel = await createTicketChannel(message.guild, message.author);
        message.channel.send(`Seu ticket foi criado: ${ticketChannel}`);
    }
});

async function createTicketChannel(guild, user) {
    const category = guild.channels.cache.find(c => c.name === ticketCategoryName && c.type === 'GUILD_CATEGORY');
    if (!category) {
        await guild.channels.create(ticketCategoryName, { type: 'GUILD_CATEGORY' });
    }

    const ticketChannel = await guild.channels.create(`ticket-${user.username}`, {
        type: 'GUILD_TEXT',
        parent: category ? category.id : null,
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: guild.roles.cache.find(role => role.name === 'Suporte').id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
        ],
    });

    await ticketChannel.send(`Olá ${user}, um membro da equipe de suporte estará com você em breve.`);
    return ticketChannel;
}

client.login('SEU_TOKEN_AQUI');
