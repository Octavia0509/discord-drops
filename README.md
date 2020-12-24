# DISCORD DROPS

<p>
  <img alt="Version" src="https://img.shields.io/npm/v/discord-drops?style=for-the-badge" />
</p>

> **Ce package vous permet de créer des "lachés" de cadeaux sur votre serveur !**

## Installer le module
```
npm i discord-drops
```

## Utilisation
Ce module **très simple d'utilisation** vous permettra de créer des lachés de cadeaux sur votre serveur. C'est à dire que vous lancerez un nouveau laché, le premier qui cliquera sur la réaction remportera le lot mis en jeu.
```js
// Importation du module
const { Drop } = require('discord-drops');
const { Client } = require('discord.js');

const client = new Client();

const settings = {
  token: "YOUR_DISCORD_BOT_TOKEN"
};

// Instanciation 
const drop = new Drop(client);

// Création du laché :
client.on('message', async message => {
  const gift = await drop.create(message, {
    prize: 'Lot qui sera à gagner'
  });
});

client.login(settings.token);
```

## Auteur
> **Lucas D.** | Discord: **Oϲτανια#5573** (ID: `638474353842978816`)

* GitHub : [Cliquez ici](https://github.com/Octavia0509)

## 📝 License
© Lucas D. | Oϲτανια#5573 - 2020-2021

> Ce projet est sous license **MIT**.