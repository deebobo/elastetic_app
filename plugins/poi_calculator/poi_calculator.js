/**
 * Created by elastetic.dev on 4/07/2017.
 * copyright 2017 elastetic.dev
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
     *
     * algorithm:
     * - route for a device is always tracked by a single 'temporary' point.
     * - when the device remains at the same location, the duration of that stay is tracked in that temp point
     * - when the device moves again, a existing point is searched that matches the temporary one, if one is found, the duration
     *   is passed on to the existing one, otherwise a new, permanent point is created
     */
    async call(plugins, funcDef, connection, data){
        let self = this;
        let toConnection = await plugins.db.connections.find(funcDef.data.to, funcDef.site);
        if(toConnection){
            var coordinates = data.data.split(',');
            let lat = parseFloat(coordinates[0]);
            let lng = parseFloat(coordinates[1]);
            //todo: this should be done at the particle.io connection level, so that everything is in json
            data.data = [lat, lng];                                     //convert to json.
            let newDate = new Date(data.timestamp);
            let to =  plugins.plugins[toConnection.plugin.name].create();
			let foundPoi = false;
			let latestPoint = await to.getLastestData(plugins, toConnection, data.device);
			if(latestPoint){
			    let latestPointChanged = false;
				if(POICalculator.calculateDistance(data.data, [latestPoint.lat, latestPoint.lng]) <= latestPoint.radius){			//check if still on same point
                    let timeLatestPoint = new Date(latestPoint.time);
                    if(!isNaN(timeLatestPoint)) {                                                               //NaN is possible when timestamp  of latest = 00:00:00, which happens when the user created the poi manually.
                        if(newDate >  timeLatestPoint) {                                                        //don't try to update the duration if the new point is older, cause then we would substract duration.
                            let duration = (new Date(data.timestamp) - timeLatestPoint) / 1000;					//we compare and work in seconds.  substr of time is in milliseconds.
                            latestPoint.duration += duration;
                            latestPointChanged = true;
                        }
                        else
                            newDate = null;
                    }
                    if(newDate) {                                                                 //if newdate is smaller, then don't stor it, we already have a newer date.
                        latestPoint.time = newDate;
                        latestPointChanged = true;
                    }
					foundPoi = true;
				}
				else if(latestPoint.duration > funcDef.data.minDuration){						//check if we stayed long enough on the previous point to consider it a poi.
					latestPoint.count++;
					latestPoint.temp = false;                                                   //found an actual point, so make certain it is no longer labeled as a temp point
                    latestPointChanged = true;
				}
				if(latestPointChanged == true)
				    await to.execute(plugins, toConnection, latestPoint);
			}
			if(!foundPoi){
				let nearest = await to.getNearestData(plugins, toConnection, data.device, lat, lng);
				let poi = self.getPoi(nearest, data.data);
				if(poi) {
                    poi.time = newDate;																	//found existing poi that we just reached, mark as latest.
                }
				else{
                    poi = await to.getTempPoint(plugins, toConnection, data.device);
                    if(poi){
                        poi.time = newDate;
                        poi.lat = lat;
                        poi.lng = lng;
                    }
                    else
                        poi = {time: new Date(data.timestamp), lat: lat, lng: lng, device: data.device, site: funcDef.site, source: connection.name, temp: true};
                }

                await to.execute(plugins, toConnection, poi);
			}
        }
        else{
            winston.log("error", "failed to find connection:", funcDef.data.to, "site:", funcDef.site)
        }
    }
	
	getPoi(list, location){
        let self = this;
        let smallest = null;                                                  //they have to be smaller then the radius anyway.
        let result = null;
		for(let i = 0; i < list.length; i++){
			let poi = list[i];
			let newDistance = POICalculator.calculateDistance(location, [poi.lat, poi.lng]);
			if((smallest == null || newDistance <= smallest) && newDistance <= poi.radius ){
			    smallest = newDistance;
                result = poi;
            }
		}
		return result;
	}
	
	//see: http://www.movable-type.co.uk/scripts/latlong.html
    /*
    possibly faster:

    var R = 6371; // Radius of the earth in km
  var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a =
     0.5 - Math.cos(dLat)/2 +
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
     (1 - Math.cos(dLon))/2;

  return R * 2 * Math.asin(Math.sqrt(a));

     */
	static calculateDistance(p1, p2){
		let R = 6371e3; 					// (Mean) radius of earth (defaults to radius in metres).
		let radiansp1 = p1[0] * Math.PI / 180; //convert to radians
		let radiansp2 = p2[0] * Math.PI / 180;
		let deltaLat = (p2[0]-p1[0]) * Math.PI / 180;
		let deltaLng = (p2[1]-p1[1]) * Math.PI / 180;

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
        author: "elastetic",
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