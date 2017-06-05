/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**
 * get a list of pages available for the current site.
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
module.exports.listPages = async function(req, res, next) {
	try{
        let db = await req.app.get('plugins');
        db = db.db;
        pages = await db.pages.list(req.params.site);
        res.json(pages);
    }
    catch(err){
        return next(err);
    }
};
