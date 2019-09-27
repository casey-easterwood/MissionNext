module.exports.DefaultErrorHandler = function(err, req, res, next) {
    res.status(500);

    console.log(err);

    res.render('error', { error: err })
};
