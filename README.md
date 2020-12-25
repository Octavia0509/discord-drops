# DISCORD DROPS

<p>
  <img alt="Version" src="https://img.shields.io/npm/v/discord-drops?style=for-the-badge" />
</p>

> **Ce package vous permet de créer des "lâchés" de cadeaux sur votre serveur !**

### ⚡ Installation

<a href="https://nodei.co/npm/discord-drops/"><img src="https://nodei.co/npm/discord-drops.png?downloads=true&downloadRank=true&stars=true"></a>

### 🎉 Utilisation

Ce module **très simple d'utilisation** vous permettra de créer des lâchés de cadeaux sur votre serveur. 
C'est-à-dire que vous lancerez un nouveau lâché, le premier qui cliquera sur la réaction remportera le lot mis en jeu.

#### __Exemple pour drop un cadeau à chaque message :__

```js
const { Drop } = require('discord-drops');
const { Client } = require('discord.js');

const client = new Client();

const drop = new Drop(client, {
    default: {
        reaction: '🎉',
    },
});

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

client.login('TOKEN');
```

#### __Events disponibles :__

```js
// Quand un drop sera lancé
drop.on('newDrop', (prize, user) => console.log(`Nouveau drop par ${user.username} avec comme lot ${prize} !`));

// Quand un drop sera accepté
drop.on('dropAccepted', (prize, user) => console.log(`Drop gagné par ${user.username} avec comme lot ${prize} !`));
```

## Auteurs
> **Lucas D.** | Discord: **Oϲτανια#5573** (ID: `638474353842978816`)

* GitHub : [Cliquez ici](https://github.com/Octavia0509)

> **Zerio Dev.** | Discord: **!Zerio.js#2020** (ID: `617498280452161538`)

* GitHub : [Cliquez ici](https://github.com/ZerioDev)

## 📝 License
© Lucas D. | Oϲτανια#5573 - 2020-2021

> Ce projet est sous license **MIT**.