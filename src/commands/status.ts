import { EmbedBuilder, Message } from 'discord.js';
import { Command } from './common/types';

const exec = async (msg: Message) => {
    const embed = new EmbedBuilder()
        .setColor(0xf01e2c) // Bright red
        .setTitle('Ping!');

    const reply = await msg.reply({
        embeds: [embed],
    });

    const { uptime } = msg.client;

    if (uptime === null) return;

    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor(uptime / 3600000) % 24;
    const minutes = Math.floor(uptime / 60000) % 60;
    const seconds = Math.floor(uptime / 1000) % 60;

    const updated = new EmbedBuilder()
        .setColor(0x0099ff) // Sky Blue
        .setTitle('Pong!')
        .addFields(
            {
                name: 'Latency',
                value: `${reply.createdTimestamp - msg.createdTimestamp}ms`,
                inline: true,
            },
            {
                name: 'API',
                value: `${reply.client.ws.ping}ms`,
                inline: true,
            },
            {
                name: 'Uptime',
                value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                inline: true,
            },
        );
    await reply.edit({ embeds: [updated] });
};

const command: Command = {
    id: 'status',
    names: ['status'],
    description: 'Shows the bot\'s status',
    exec
};

export default command;