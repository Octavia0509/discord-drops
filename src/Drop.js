const { EventEmitter } = require('events');
const { MessageEmbed } = require('discord.js');

module.exports = class Drop extends EventEmitter {

    /**
     * @param {Discord.Client} client - Représente le client
     */

    constructor(client) {
        super()

        if(!client) throw new Error("Un Discord Client doit être précisé.");

        this.client = client;
    };

    async create(message, options) {
        if(typeof options !== "object") throw new Error("Les options doivent être dans un objet.");

        if(!options.prize) throw new Error("Une option \"prize\" doit être précisée.");

        if(typeof options.prize !== "string") throw new Error("L'option \"prize\" doit être de type String.")
        
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("#D8FF00")
            .setTitle("🎁 » __**DROP**__")
            .setDescription(`😃 \`Par\` ➔ ${message.author} ⋄ **${message.author.tag}** \n🥇 \`Lot\` ➔ ${options.prize} \n\n\n→ Le premier qui clique sur la réaction 🎊 remporte le lot mis en jeu !`)

        message.channel.send({ embed }).then(async msg => {
            msg.react("🎊");

            const filter = (reaction, user) => {
                if(user.bot) return;
                return reaction.emoji.name === "🎊" && user.id !== message.author.id;
            };

            const collector = msg.createReactionCollector(filter, { max: 1 });

            collector.on("collect", async () => {
                const winEmbed = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("#D8FF00")
                    .setTitle("🎁 » __**DROP**__")
                    .setDescription(`🥇 \`Lot\` ➔ ${options.prize} \n\n➡ **Nous avons un gagnant!** \n\n→ <@${msg.reactions.cache.first().users.cache.filter(u => !u.bot && u.id !== message.author.id).first().id}> ⋄ **${msg.reactions.cache.first().users.cache.filter(u => !u.bot && u.id !== message.author.id).first().tag}**`)
    
                msg.edit({ embed: winEmbed });
            });
        });
    };

};