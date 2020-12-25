const { EventEmitter } = require('events');

const defaultOptions = { reaction: '🎉' };

module.exports = class Drop extends EventEmitter {

    /**
     * Instancie la classe 'Drop'; obligatoire par la suite
     * @constructor
     * @param {Discord.Client} client - Représente le client
     * @param {object} options - Options de la classe
     */

    constructor(client, options) {
        super();

        if (!client) throw new Error('Un Discord Client doit être précisé.');

        this.client = client;
        this.options = defaultOptions;

        for (const prop in options.default) this.options[prop] = options.default[prop];
    };

    /**
     * 
     * @param {message} message - Paramètre de votre événement 'message' 
     * @param {object} options - Options de la création du drop
     */

    async create(message, options) {
        if (!message) throw new Error('Vous devez donner un message (paramètre de votre événement).');

        if (typeof options !== 'object') throw new Error('Les options doivent être dans un objet.');

        if (!options.prize) throw new Error('Une option prize doit être précisée.');

        if (typeof options.prize !== 'string') throw new Error("L'option prize doit être de type String.")

        message.channel.send({
            embed: {
                color: options.embed.color ? options.embed.color : 'BLUE',
                author: { name: options.embed.title ? options.embed.title.replace('{prize}', options.prize).replace('{creator}', message.author.username) : 'Nouveau drop !' },
                footer: { text: options.embed.footer ? options.embed.footer : `Soyez le premier à cliquer sur ${this.options.reaction} pour remporter le lot !` },
                timestamp: new Date(),
                description: options.embed.field ? options.embed.field.replace('{prize}', options.prize).replace('{creator}', message.author) : `Lot : ${options.prize} par ${message.author}`,
            },
        }).then(async msg => {
            msg.react(this.options.reaction);

            this.emit('newDrop', options.prize, message.author);

            const filter = (reaction, user) => {
                if (user.bot) return;
                return reaction.emoji.name === this.options.reaction && user.id !== message.author.id;
            };

            const collector = msg.createReactionCollector(filter, { max: 1 });

            collector.on("collect", async () => {
                const winner = {};

                winner.id = msg.reactions.cache.first().users.cache.filter(u => !u.bot && u.id !== message.author.id).first().id;
                winner.username = msg.reactions.cache.first().users.cache.filter(u => !u.bot && u.id !== message.author.id).first().tag;

                this.emit('dropAccepted', options.prize, msg.reactions.cache.first().users.cache.filter(u => !u.bot && u.id !== message.author.id).first());

                msg.edit({
                    embed: {
                        color: options.winEmbed.color ? options.winEmbed.color : 'RED',
                        author: { name: options.winEmbed.title ? options.winEmbed.title.replace('{prize}', options.prize).replace('{creator}', message.author.username).replace('{winner.id}', winner.id).replace('{winner.username}', winner.username) : 'Drop remporté !' },
                        footer: { text: options.winEmbed.footer ? options.winEmbed.footer : 'Bravo au plus rapide !' },
                        timestamp: new Date(),
                        description: options.winEmbed.field ? options.winEmbed.field.replace('{prize}', options.prize).replace('{creator}', message.author.username).replace('{winner.id}', winner.id).replace('{winner.username}', winner.username) : `Lot : ${options.prize} remporté par ${winner.username} (${winner.id})`,
                    },
                });
            });
        });
    };

};