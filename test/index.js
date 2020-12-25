const { Drop } = require('../main');
const { Client } = require('discord.js');

const client = new Client();

const drop = new Drop(client, {
    default: {
        reaction: '🎉',
    },
});

client.on('ready', () => console.log('Ready !'));

client.on('message', async message => {
    if (message.author.bot) return;

    await drop.create(message, {
        prize: 'Nitro',
        embed: {
            color: 'RED',
            title: 'Nouveau drop !',
            field: 'Drop lancé par : {creator}\nLot à remporter : {prize}',
            footer: 'Soyez le premier à cliquer sur la réaction pour remporter le lot !',
        },
        winEmbed: {
            color: 'RED',
            title: 'Bravo !',
            field: 'Drop lancé par : {creator}\nLot gagné : {prize} par {winner.username} ({winner.id})',
            footer: 'Bravo à toi qui a été le plus rapide !',
        },
    });
});

drop.on('newDrop', (prize, user) => console.log(`Nouveau drop par ${user.username} avec comme lot ${prize} !`));

drop.on('dropAccepted', (prize, user) => console.log(`Drop gagné par ${user.username} avec comme lot ${prize} !`));

client.login('TOKEN');