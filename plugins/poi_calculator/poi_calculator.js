/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');
const Function = require.main.require('../plugins/base_classes/function');


/**
 * calculates points of interest based on ge location info.
 * the 'from' connection should provide device and location info (lat, lng) in the data field.
 * the 'to' conneciton has to be a x_poi_data connection able to handle poi. It uses the: 
 *    - 'standard' interface for storing (execute). This is for add and update (add id for update)
 *    - 'getNearest' for retrieving records close by a certain point.
 *
 * custom data parameters for the function:
 * - maxDist: the maximum distance between 2 points to consider to be the same (default: 15 meters)
 * - minDuration: the minimum amount of time that a user has to spend at a specific place for it to become a point of interest
*/
class POICalculator extends Function {

    constructor() {
        super();
    }

    /**
     * performs the function (transport data from source to dest).
     * @param plugins {Object} a ref to the plugins object, for finding the connection plugins.
     * @param funcDef {Object} the function instance data (defines the connection source and destination)
     * @param connection {Object} the connection from where the request originated.

     * @param data {Object} the data to process
     */
    async call(plugins, funcDef, connection, data){
        let toConnection = await plugins.db.connections.find(funcDef.data.to, funcDef.site);
        if(toConnection){
            let to =  plugins.plugins[toConnection.plugin.name].create();
			let foundPoi = false;
			let latestPoint = await to.getLatest(plugins, toConnection, data.device, data.time);
			if(latestPoint){
				if(calculateDistance(data.data, [poi.lat, poi.lng]) <= funcDef.data.maxDist){			//check if still on same point
					let duration = data.time - latestPoint.time;
					latestPoint.duration += duration;
					latestPoint.time = data.time;
					foundPoi = true;
				}
				else if(latestPoint.duration > funcDef.data.minDuration){						//check if we stayed long enough on the previous point to consider it a poi.
					latestPoint.count++;
				}
				to.execute(plugins, toConnection, latestPoint);
			}
			if(!foundPoi){
				let nearest = await to.getNearest(plugins, toConnection, data.device, data.data[0], data.data[1]);
				let poi = getPoi(nearest, data.data, funcDef.data.maxDist);
				if(poi)
					poi.time = data.time;																	//found existing poi that we just reached, mark as latest.
				else
					poi = {time: data.time, lat: data.data[0], lng: data.data[1], device: data.device, site: funcDef.site, source: connection.name};
				to.execute(plugins, toConnection, poi);
			}
        }
        else{
            winston.log("error", "failed to find connection:", funcDef.data.to, "site:", funcDef.data.site)
        }
    }
	
	getPoi(list, location, maxDist){
		for(let i = 0; i < nearest.length; i++){
			let poi = nearest[i];
			if(calculateDistance(location, [poi.lat, poi.lng]) <= maxDist)
				return poi;
		}
		return null;
	}
	
	//see: http://www.movable-type.co.uk/scripts/latlong.html
	calculateDistance(p1, p2){
		var R = 6371e3; 					// (Mean) radius of earth (defaults to radius in metres).
		var φ1 = p1[0].toRadians();
		var φ2 = p2[0].toRadians();
		var Δφ = (p2[0]-p1[0]).toRadians();
		var Δλ = (p2[1]-p1[1]).toRadians();

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
				Math.cos(φ1) * Math.cos(φ2) *
				Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = R * c;
		return d;
	}
}

//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "poi_calculator",
        category: "function",
        title: "POI calculator",
        description: "calculates points of interest based on geo location data and stores it in a db.",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
        license: "GPL-3.0",
        config:{
            partial: "transporter_config_partial.html",
            code: ["transporter_config_controller.js"]
        },
        create: function(){ return new POICalculator();}
    };
};

module.exports = {getPluginConfig: getPluginConfig};