/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

 
/**@ignore */ 
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require.main.require('../api/libs/config');

/**
 * @class represents the users collection
 */
class Users{

    /**
     * @constructor	 *
	 * * creates the collection that stores the user information.
     * 	- fields:
     *		- name: the name of the admin user.
     *		- email: the email address of the admin user
     *		- hashedPassword: a hash value of the password for the user.
     * 		- salt: encryption token
     * 		- site: the site to which the user has access
     *  	- createdOn: date of record creation
     * 		- group: the group to which this user belongs
     * 	- virtual fields:
     *		- password: when set, calculate salt and hashedPassword
     * 	- keys:
     * 		- (unique) email - site
     *		- (unique) name - site
     */
    constructor(){
        let usersSchema = new mongoose.Schema({
            name: {type: String, required: true},
            email: {type: String, required: true},
            hashedPassword: {type: String, required: true},
            salt: {type: String, required: true},
            site: {type: String, required: true},
            createdOn: {type: Date, default: Date.now()},
            accountState: {type: String, enum: ['created', 'verified', 'pwdReset'], default: 'created'},	//current state of the account, so we know if verification is needed or pwd has been reset
            verificationToken: String,																		//if verification or pwd reset is needed, this field is filled in.
            groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'groups'}]
        });
        usersSchema.methods.encryptPassword = function(password) {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
        };
        usersSchema.virtual('userId').get(function () {
            return this.id;
        });
        usersSchema.virtual('password')
            .set(function(password) {
                this._plainPassword = password;
                this.salt = crypto.randomBytes(32).toString('hex');
                //more secure - this.salt = crypto.randomBytes(128).toString('hex');
                this.hashedPassword = this.encryptPassword(password);
            })
            .get(function() { return this._plainPassword; });

        usersSchema.methods.checkPassword = function(password) {
            return this.encryptPassword(password) === this.hashedPassword;
        };

        usersSchema.methods.generateJwt = function() {
            let expiry = new Date();
            expiry.setDate(expiry.getDate() + config.config.security.expires);
            try {
                return jwt.sign({
                    id: this._id,
                    email: this.email,
                    name: this.name,
                    site: this.site,
                    exp: parseInt(expiry.getTime() / 1000),
                }, config.config.security.secret);
            }
            catch (err){
                winston.log("error", err);
                return null;
            }
        };

        usersSchema.index({ email: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        usersSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that name + site is unique in the system.
        this._users = mongoose.model('users', usersSchema);
    }

    /**
     * adds a user to the db
     *
     * @name .add()
     * @param {Object} `user` details about the user. The object should contain the following fields:
	 *	- name: the name of the user. 
	 *	- email: the email address of the admin user
	 *	- password: the password for the user.
	 * 	- site: the site to which the user has access
	 * 	- group: the group to which this user belongs
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(user){
        let record = new this._users(user);
        return record.save();
    }
	
	/**
     * updates a user
     *
     * @name .update()
     * @param {Object} `user` see add for more details
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(user){
        return this._users.findOneAndUpdate({"_id": user._id}, user).exec();
    }
	
	/**
     * updates the account state of a user
     *
     * @name .update()
     * @param {string} `id` the id of the user
	 * @param {string} `value` the new value of the account state
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
	updateAccountState(id, value){
		return this._users.findOneAndUpdate({"_id": id}, {accountState: value}).exec();
	}


    /** Returns all the users of a particular site.
     * @param {string} `site` The name of the site to list the groups for.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the list of groups
     */
    list(site){
        let query = this._users.find({site: site}).populate('groups');
        return query.exec();
    }

    /**
     * finds a single record by id
     * populates the groups list, so it can easily be searched for (editor levels and such, for authorisation)
     * @name .find()
     * @param id {string}  - id of the user record.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(id){
        return this._users.findOne({_id: id}).populate('groups').exec();
    }

	/**
     * finds a user by name or email for a specific site.
     * populates the groups list, so it can easily be searched for (editor levels and such, for authorisation)
     * @name .find()
     * @param value {string}  - name or email of the user.
	 * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    findByNameOrEmail(value, site){
        return this._users.findOne( { $or: [{ name: value, site: site }, {email: value, site: site}]} ).populate('groups').exec();
    }
	
	/** adds a user to the specified group
	 * @param user {string}  - id of the user.
	 * @param group {string}  - id of the group.
	*/
	addGroup(user, group){
		return this._users.findByIdAndUpdate(user,
											{$push: {"groups": group}},
											{safe: true, upsert: true, new : true});
	}
	
	/** removes the user from the specified group
	 * @param user {string}  - id of the user.
	 * @param group {string}  - id of the group.
	*/
	removeGroup(user, group){
		return this._users.findByIdAndUpdate(user, {$pullAll: {"groups": [group]}});
	}
}

module.exports = Users;
