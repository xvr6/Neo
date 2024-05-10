const config = require("../jsons/config.json")
// const WLPath = "../../Bungee4/lobby/whitelist.json"
// const whitelist = require(WLPath)
const errors = require('../utils/errors.js');
const {verified} = require('../libs/wldb.js');
const fs = require("fs");
const RCON = require('rcon')

//TODO: change these with your specific rcon info. I recomend using a .env file.
const pass = process.env.RCONPASS
const rconip = 'localhost'
const rconport = 25575 

module.exports = {
	name: 'guildMemberRemove',
	async run (member, token) {
		if (member.guild.id != config.myServer) return;

		let currentUser = await verified.findOne({where: {id: member.id}});
		if (!currentUser) return;
	
		//TODO: Remove from whitelist with rcon
		const conn = new RCON(rconip, rconport, pass);
		conn.connect()

		conn.on('auth', async () => {
			conn.send(`whitelist remove ${currentUser.uuid}`)
			conn.send(`whitelist reload`)
			conn.disconnect()
		});
		await verified.destroy({ where: { id: member.id } });
					 
	}
}