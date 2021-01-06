const { EventEmitter } = require('events');
const Discord = require('discord.js');

module.exports = class Drop extends EventEmitter {

    /**
     * Instancie la classe 'Drop'; obligatoire par la suite
     * @constructor
     * @param {Discord.Client} client - Représente le client
     * @param {string} reaction - Réaction ajoutée au message du drop
     */

    constructor(client, reaction) {
        super();

        if (!client) throw new Error('Un Discord Client doit être précisé.');

        this.client = client;

        if(reaction) {
            if(typeof reaction !== "string") throw new Error("Vous devez entrer un émoji valide (String)");
            this.reaction = reaction;
        } else this.reaction = "🎊";
    };

    /**
     * 
     * @param {message} message - Paramètre de votre événement 'message' 
     * @param {object} options - Options de la création du drop
     * * `prize` (prix du drop) - **Obligatoire**
     * * `color` (couleur embed de base) - **Facultatif**
     * * `title` (titre embed de base) - **Facultatif**
     * * `footer` (footer embed de base) - **Facultatif**
     * * `content` (description embed de base) - **Facultatif**
     * @type {object}
     */

    async create(message, options) {
        if (!message) throw new Error('Vous devez donner un message (paramètre de votre événement).');

        if (typeof options !== 'object') throw new Error('Les options doivent être dans un objet.');

        if (!options.prize) throw new Error('Une option prize doit être précisée.');
        if (typeof options.prize !== 'string') throw new Error("L'option prize doit être de type String.");

        this.options = {
            prize: options.prize,
            color: 'color' in options ? options.color : "#FFCB59",
            author: 'title' in options ? options.title.replace(/{prize}/g, options.prize).replace(/{creator}/g, message.author.username) : '🎊 Nouveau drop par ' + message.author.username,
            footer: 'footer' in options ? options.footer : `Soyez le premier à cliquer sur ${this.reaction} pour remporter le lot !`,
            content: 'content' in options ? options.content.replace(/{prize}/g, options.prize).replace(/{creator}/g, message.author) : `${message.author} fait gagner ${options.prize} dans ce nouveau drop 🎊 !`
        }

        message.channel.send({
            embed: {
                color: this.options.color,
                author: { name: this.options.author },
                footer: { text: this.options.footer },
                description: this.options.content
            },
        }).then(async msg => {
            msg.react(this.reaction).catch(() => {
                throw new Error("Une erreur est survenue lors de l'ajout de la réaction !")
            })

            this.emit('dropCreate', options.prize, message.author.username);

            const filter = (reaction, user) => {
                if (user.bot) return;
                return reaction.emoji.name === this.reaction && user.id !== message.author.id;
            };

            const collector = msg.createReactionCollector(filter, { max: 1 });

            collector.on("collect", async () => {
                const winner = {};
                winner.id = msg.reactions.cache.first().users.cache.filter(u => !u.bot && u.id !== message.author.id).first().id;
                winner.username = msg.reactions.cache.first().users.cache.filter(u => !u.bot && u.id !== message.author.id).first().tag;

                msg.edit({
                    embed: {
                        color: '#8fffb0',
                        author: { name: '🏆 Drop remporté !' },
                        footer: { text: 'Félicitations ' + winner.username + " !" },
                        description: `Le lot **${this.options.prize}** vient d'être remporté par ${message.guild.members.cache.get(winner.id)} (**${winner.id}**)`,
                    },
                }).then(() => this.emit('dropWin', options.prize, winner.username));
            });
        });
    };

};