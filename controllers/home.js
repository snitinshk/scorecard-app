exports.index = async function (req, resp, next) {
    resp.render('home.ejs');
}