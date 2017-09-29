/**
 * Created by elastetic.dev on 26/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */



const unzip = require('unzip');
const winston = require('winston');
const tmp = require('tmp');
const mkdirp = require('mkdirp');
const path = require('path');


//loads the plugin config file and returns the object
function loadConfig(filename) {
    let data = fs.readFileSync(filename);
    config = JSON.parse(data);
    winston.log("info", 'succesfully loaded plugin config ', config);
    return config;
}

/**
 * extracts a file called config.json from the specified zipfile.
 * @param {string} zipFile the path to a zip file.
 */
async function extractConfigFile(zipFile) {
    return new Promise((resolve, reject) => {
        let tmpObj = tmp.filename();
        fs.createReadStream('path/to/archive.zip')
            .pipe(unzipper.Parse())
            .on('entry', function (entry) {
                //var type = entry.type; // 'Directory' or 'File'
                if (entry.path === "pluginconfig.json") {
                    entry.pipe(fs.createWriteStream(tmpObj.name)
                        .end(resolve(tmpObj.name))
                        .on('error', (err) => {reject(err);})
                    );
                } else {
                    entry.autodrain();
                }
            });
        reject("not found");
        }
    );
}

async function installInto(path, fileDetails){
    try {
        let tmpobj = tmp.dirSync();												//temp directory to unzip the content.

        try {
            //fs.createReadStream(fileDetails.path).pipe(unzip.Extract({path: tmpobj.name}));
            let config = await extractConfigFile(fileDetails.path);
            config = loadConfig(config);                                                //fs.join(tmpobj.name, "config.json")
            let path = path.join(path, config.name);			//the path where stuff gets installed.
            try {
                mkdirp(path);																	//this happens async!!
            } catch (err) {
                throw err;
            }
            winston.log("info", "extracting plugin %s to temp dir %s", fileDetails.path, path);
            fs.createReadStream(fileDetails.path).pipe(unzip.Extract({path: path}));
            let result = config;
            //result.path = path;                                         //the server needs to know the path of the plugin.
            return result;
        }
        finally {
            tmpobj.removeCallback();											// Manual cleanup
        }
    }
    catch (err) {
        winston.log("error", 'failed to load plugin config');
        throw Error('failed to load plugin config');
    }
}

/** install a client plugin for a site or global
 * @param {string} site the name of the site. When null, installs global, for all sites available.
 * @param {Object} fileDetails: an express file upload data structure.
 */
module.exports.install = async function (fileDetails, site) {
    return installInto(path.join(__dirname, 'public', 'plugins', site), fileDetails);
};

/** install a server plugin for the entire application.
 */
module.exports.serverInstall = async function (fileDetails, site) {
    return installInto(path.join(__dirname, 'plugins', site), site, fileDetails);
};

/**
 * uninstall the packet from the server.
 * @param name
 * @param site
 * @returns {Promise.<void>}
 */
module.exports.uninstall = async function(name, site){
    winston.log("error", "not yet implemented.")
};