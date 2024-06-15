# NeoV14
To launch this bot, use the command `node index --env-file=.env`
If using nodemon, run `nodemon -e js --env-file=.env`

## Folder Structure
> [!Note]
> Please note that this folder structure is designed in a way that allows all new commands and event handlers to be added dynamically. The only thing the user needs to do is reference the templates present in `./TEMPLATES`!

- `./commands/`
    - This folder contains subfolders each pertaining to their category name like so: `/<category>/<name>.js`
    - Categories are largely non-implemented at the moment, though they are a nice way to organize everything!
- `./events/`
    - This folder contains discord event handler files named for the event in which they correspond to
    - Ex) `./events/guildMemberRemove.js` is the guildMemberRemove event.
- `./libs/`
    - This folder currently contains two files, one for each database this bot uses. Each database has multiple purposes and functionality, though it is broken up for easier debugging and testing.
    - These files will generate a subfolder `./libs/DATA` containing two `.db` files when run. I recomend using the VSC plugin [SQLite Viewer](https://marketplace.visualstudio.com/items?itemName=qwtel.sqlite-viewer) to visually see what's being stored.
- `./utils/`
    - This folder contains utility and helper functions.


## This bot needs a .env file to function. Said file should be structured as such:
```
TOKEN="discord token"
DEVTOKEN=" discord token" <-- not necessary, i use this to jump between two bot instances easier
RCONPASS="RCON password" <-- used for minecraft whitelisting system
```