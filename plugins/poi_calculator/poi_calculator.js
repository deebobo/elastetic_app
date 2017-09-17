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
 *    - 'getNearestData' for retrieving records close by a certain point.
 *    - 'getLatestData' for retrieveing the last recorded value.
 *
 * custom data parameters for the function:
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
        let self = this;
        let toConnection = await plugins.db.connections.find(funcDef.data.to, funcDef.site);
        if(toConnection){
            let to =  plugins.plugins[toConnection.plugin.name].create();
			let foundPoi = false;
			let latestPoint = await to.getLastestData(plugins, toConnection, data.device, data.timestamp);
			if(latestPoint){
				if(calculateDistance(data.data, [poi.lat, poi.lng]) <= poi.radius){			//check if still on same point
					let duration = (data.timestamp - latestPoint.time) / 1000;					//we compare and work in seconds.  substr of time is in milliseconds.
					latestPoint.duration += duration;
					latestPoint.time = data.timestamp;
					foundPoi = true;
				}
				else if(latestPoint.duration > funcDef.data.minDuration){						//check if we stayed long enough on the previous point to consider it a poi.
					latestPoint.count++;
				}
				to.execute(plugins, toConnection, latestPoint);
			}
			if(!foundPoi){
				let lat = parseFloat(coordinates[0]);
				let lng = parseFloat(coordinates[1]);
                var coordinates = data.data.split(',');
				let nearest = await to.getNearestData(plugins, toConnection, data.device, lat, lng);
				let poi = self.getPoi(nearest, data.data);
				if(poi)
					poi.time = data.timestamp;																	//found existing poi that we just reached, mark as latest.
				else
					poi = {time: data.timestamp, lat: lat, lng: lng, device: data.device, site: funcDef.site, source: connection.name};
				to.execute(plugins, toConnection, poi);
			}
        }
        else{
            winston.log("error", "failed to find connection:", funcDef.data.to, "site:", funcDef.site)
        }
    }
	
	getPoi(list, location){
        let self = this;
		for(let i = 0; i < list.length; i++){
			let poi = list[i];
			if(self.calculateDistance(location, [poi.lat, poi.lng]) <= poi.radius)
				return poi;
		}
		return null;
	}
	
	//see: http://www.movable-type.co.uk/scripts/latlong.html
	static calculateDistance(p1, p2){
		let R = 6371e3; 					// (Mean) radius of earth (defaults to radius in metres).
		let radiansp1 = p1[0].toRadians();
		let radiansp2 = p2[0].toRadians();
		let deltaLat = (p2[0]-p1[0]).toRadians();
		let deltaLng = (p2[1]-p1[1]).toRadians();

		let a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
				Math.cos(radiansp1) * Math.cos(radiansp2) *
				Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		return R * c;
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