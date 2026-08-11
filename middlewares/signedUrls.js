const { signS3UrlsDeep } = require("../utilities/S3SignedUrl");

exports.signS3UrlsInResponses = (req, res, next) => {
    const sendJson = res.json.bind(res);

    res.json = (body) => {
        signS3UrlsDeep(body)
            .then(sendJson)
            .catch((error) => {
                console.log("ERROR WHILE SIGNING S3 URLS:", error);
                sendJson(body);
            });
        return res;
    };

    return next();
};
