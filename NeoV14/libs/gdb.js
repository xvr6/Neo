const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({ username: DataTypes.STRING, database: DataTypes.STRING, 
							dialect: "sqlite", dialectModule: require("sqlite3"), 
							storage: `${__dirname}/DATA/GUILD_INFO.db`, define: {freezeTableName: true, charset: "utf-8"}, logging: false
						});

const rr = sequelize.define("rr", {
	guild: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	message: {
		type: DataTypes.STRING,
		allowNull: false
	},
	roles: {
		type: DataTypes.JSON,
		/*
		type: DataTypes.TEXT,
		get() {
			return JSON.parse(this.getDataValue('roles'));
		},
		set(val) {
			this.setDataValue('roles', JSON.stringify(val));
		}	
		*/
	}
});

const vcCreator = sequelize.define("vcCreator", {
	guild: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	channel: {
		type: DataTypes.STRING,
	},
	category: {
		type: DataTypes.STRING,
	},
	spawnedVCs: {
		type: DataTypes.TEXT, //array of strings representing the ids of the spawned vcs
		allowNull: false,
		defaultValue: '[]',
		get() {
			return JSON.parse(this.getDataValue('spawnedVCs'));
		},
		set(val) {
			this.setDataValue('spawnedVCs', JSON.stringify(val));
		},	
		//defaultValue: [],
	}
});

(async () => {
	await sequelize.sync();
})()


module.exports = {
	rr,
	vcCreator
}

//sequelize = new _sequelize.Sequelize({ username: config.db_user, database: config.db_name, password: config.db_password, dialect: "sqlite", dialectModule: require("sqlite3"), storage: config.db_file, define: {freezeTableName: true, charset: "utf-8"}, logging: log })