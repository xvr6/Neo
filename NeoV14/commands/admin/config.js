const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { guildPref } = require('../../libs/gdb.js')

module.exports = {
    aliases: ['cfg', 'pref'],   // array of aliases for the command. Will Dynamically add them to the commandhandler.
    ephemeral: false, // true or false - if true, the command will only be visible to the user who ran it.
    category: '', // category of the command. Will be used for the help command (currently a placeholder)
    data: new SlashCommandBuilder()
        .setName('config') // name of command should be the same as file name.
        .setDescription('Sets the server configuration for this server')
        .addStringOption(option => option.setName('setting')
            .setDescription('The name of the option you\'d like to change. Leave blank for a printout.')
            .setRequired(false)
        ),

    async run(interaction) {
        const name = interaction.options.getString('setting');
        let gp = await guildPref.findOrCreate({ where: { guild: interaction.guild.id } });
        gp = gp[0];

        if (!name) {
            return printOut(interaction, gp);
        } else { //edit setting given
            //TODO: add the ability to set the limit of temp VCs for the server
            //      perhaps use buttons for each specific setting and one additional for displaying the current settings
            switch (name) {
                case 'vccLimit':
                    if (limit < 10 || limit > 25) {
                        return interaction.reply({ content: 'The limit must be between 10 and 25.', ephemeral: true });
                    }
                    gp.vccLimit = limit;
                    await gp.save();
                    return interaction.reply({ content: `The limit has been set to ${limit}.`, ephemeral: true });

                default:
                    return interaction.reply({ content: 'That setting does not exist.', ephemeral: true });
            }

        }
    }
}

async function printOut(interaction, gp) {
    let embed = new EmbedBuilder()
        .setTitle('Server Configuration')
        .setDescription(`The current configuration for this server is:`)

    for (const [key, value] of Object.entries(gp)) {
        console.log("key:", key, "value", value);
        embed.addFields({ name: key.toString(), value: value.toString(), inline: true});
    }
    
    return interaction.editReply({ embeds: [embed], ephemeral: true });
}