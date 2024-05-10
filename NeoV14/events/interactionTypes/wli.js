const { unverified, verified, blacklist } = require('../../libs/wldb.js')
const minersRoleID = "1075267520644263956"
const fs = require("fs")
const { EmbedBuilder } = require('discord.js')
const config = require('../../jsons/config.json')
const RCON = require('rcon')
const { fetchMcUUID } = require("../../utils/mcUtils.js")

//TODO: change these with your specific rcon info. I recomend using a .env file.
const pass = process.env.RCONPASS
const rconip = 'localhost'
const rconport = 25575


async function wli(interaction) {
    let id = interaction.customId.split("_")[2]
    //fetch from db
    let unvUser = (await unverified.findByPk(id))
    console.log()
    if (!unvUser) return;

    if (interaction.customId.includes("VERIFY")) { // this is where whitelist happens
        //TODO: check if balcklisted
        //Add the role!
        interaction.member.roles.add(minersRoleID)
        const mc = await fetchMcUUID(unvUser.uuid)

        const conn = new RCON(rconip, rconport, pass);
        conn.connect()

        success = false
        conn.on('auth', async () => {
            conn.send(`whitelist add ${mc.name}`)
            conn.send(`whitelist reload`)
            conn.disconnect()
        });/*.on('response', (str) => {
            success = str.includes('Added') // successful if so. Other response is 'already whitelisted', so false
        }).on('error', (err) => {  
            console.error(err)
        }).on('end', () => {
            console.log("Connection closed.")
        });*/


        let embed = new EmbedBuilder()
            .setTitle(`Whitelisted user:`)
            .setColor(config.posHex)
            .setDescription(`<@${id}> has been waitlisted under the account: \n**${mc.name} | \`${mc.uuid}\`**`);

        interaction.reply({ embeds: [embed] });
        interaction.message.delete()

        //make verified
        let vUser = new verified({ id: id, uuid: mc.uuid })
        await vUser.save();
        //delete unv
        await unverified.destroy({ where: { id: id } })

        try {
            //fetch origonal message stored in the db
            let wl_channel = await interaction.guild.channels.cache.get('755232058049298465')
            let wlMsg = await wl_channel.messages.fetch(unvUser.wlMsg)
            wlMsg.delete()

            let acceptEmbed = new EmbedBuilder()
                .setTitle('Whitelisted Successfully!')
                .setColor(config.posHex)
                .setDescription(`You have been whitelisted with the username: **${mc.name}**!`);

            wl_channel.send({ content: `<@${id}>`, embeds: [acceptEmbed], components: [] });
        } catch (e) { return console.log(e) }


    } else { //blacklist
        let wlChannel = await interaction.guild.channels.cache.get('755232058049298465')

        try {
            var wlMsg = await wlChannel.messages.fetch(unvUser.wlMsg)
        } catch { }

        //make blacklist
        let blUser = await new blacklist({ id: id });
        blUser.save()

        //delete unv user.
        await unverified.destroy({ where: { id: id } })

        try {
            //fetch origonal message stored in the db

            let blacklistEmbed = new EmbedBuilder()
                .setTitle('Blacklisted')
                .setColor(config.negHex)
                .setDescription(`<@${id}> has been blacklisted and will not be able able to whitelist again.\nUndo this with \`/delblacklist <discord user>}\``);

            interaction.reply({ embeds: [blacklistEmbed] });
            interaction.message.delete();

            wlMsg.edit({
                embeds: [blacklistEmbed.setDescription(
                    `<@${id}> has been blacklisted and will not be able able to whitelist again.\nPlease contact an admin if you believe this is a mistake.`)],
                components: []
            });


        } catch { };
    }
}

module.exports = { wli }