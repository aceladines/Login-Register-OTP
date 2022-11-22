module.exports.session = (req) => {
    let session;
    session = req.session;
    session.userid= req.body.username;
    console.log(req.session)
}