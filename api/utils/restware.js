'use strict';

// third party components
var oFs = require('fs');

var sendSuccess = function (res, data, iHttpStatus) {
    if (!res) {
        return;
    }

    var httpStatus = iHttpStatus ? iHttpStatus : 200;

    var out = null;
    if(data){
        out = data;
    }

    res.status(httpStatus);
    res.contentType('json');

    return res.json(out);
}

var sendSuccessDownload = function (res, absolutionPath) {
    if (!res) {
        return;
    }

    if(oFs.existsSync(absolutionPath)){
        res.status(200);
        return res.download(absolutionPath);
    }else{
        res.status(500);
        res.contentType('json');
        var out = {};
        out.error = 'DownloadFail';
        out.info = 'file doesnt exist';
        console.log(JSON.stringify(out));
        return res.json(out);
    }
}

var sendSuccessHtml = function (res, htmlContent) {
    if (!res) {
        return;
    }

    if(htmlContent){
        res.status(200);
        return res.send(htmlContent);
    }else{
        res.status(500);
        res.contentType('json');
        var out = {};
        out.error = 'RenderFail';
        out.info = 'some errors happen';
        console.log(JSON.stringify(out));
        return res.json(out);
    }
}

var sendSuccessToken = function (res, token, user) {
    if (!res) {
        return;
    }

    var out = {};

    out.token = token;
    out.id = user.id;
    out.username = user.username;
    out.displayName = user.displayName;
    out.email = user.email;
    out.userRight = user.userRight;
    out.avatarUrl = user.avatarUrl;

    res.status(200);
    res.contentType('json');
    return res.json(out);
}

var sendError = function (res, errorCode, errorMessage, httpStatus) {
    if (!res) {
        return;
    }

    var out = {};
    var errmsg = errorMessage ? errorMessage.toString() : "NONE";
    var status = httpStatus ? httpStatus : 500;

    out.error = errorCode;
    out.info = errmsg;

    res.status(status);
    res.contentType('json');
    console.log(JSON.stringify(out));
    return res.json(out);
}

module.exports = {
    sendSuccess: sendSuccess,
    sendError: sendError,
    sendSuccessToken: sendSuccessToken,
    sendSuccessDownload: sendSuccessDownload,
    sendSuccessHtml: sendSuccessHtml
}