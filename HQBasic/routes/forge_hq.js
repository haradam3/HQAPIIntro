//
// (C) Copyright 2016 by Autodesk, Inc.
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE. AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
//
// Use, duplication, or disclosure by the U.S. Government is subject to
// restrictions set forth in FAR 52.227-19 (Commercial Computer
// Software - Restricted Rights) and DFAR 252.227-7013(c)(1)(ii)
// (Rights in Technical Data and Computer Software), as applicable.
//
// Written by M.Harada. 
// 

var request = require("request");

// Production keys 
// Dont's keep the client id and secret at client side. 
// Keep it at server side for 2-legged. 

// To Do: set your key and secret.  
var _baseUrl = "https://developer.api.autodesk.com/";  
var _apiKey = "<your api key comes here>";
var _apiSecret = "<your api secret comes here>";

// Forge OAuth 2-legged for HQ
//  
// For HQ, you need to use 2-legged Authentication 
// authentication/v1/authenticate
// https://developer.autodesk.com/en/docs/oauth/v2/reference/http/authenticate-POST/
// 

exports.authenticate= function (req, res) {
    var options = {
        method: 'POST',
        url: _baseUrl + 'authentication/v1/authenticate',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded'
        },
        form: {
            client_id: _apiKey,
            client_secret: _apiSecret, 
            grant_type: "client_credentials", 
            scope: "data:read account:read account:write bucket:read"
        }
    };
    
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        // console.log(body);
        
        var ticket = "";
        var jsonObj = JSON.parse(body);
        if (jsonObj) {
            token = jsonObj.access_token;
        }
        // Save ticket as a session data.
        req.session.token = token;
        
        // Send back the result 
        res.send(body);
    });
}

// Company 
//
// Get a list of companies 
// hq/v1/accounts/:account_id/companies
// https://developer.autodesk.com/en/docs/bim360/v1/reference/http/companies-GET/
// 

exports.company = function (req, res) {
    var body = req.body; 
    var method = 'GET'; // body.method; 
    var account_id = body.account_id;
    var url = _baseUrl + 'hq/v1/accounts/' + account_id + '/companies';
    
    var tokenHeader;
    if (req.session.token) {
        tokenHeader = 'Bearer ' + req.session.token; 
    }

    var options = {
        method: method,
        url: url,
        headers: {
            'cache-control': 'no-cache',
            Authorization: tokenHeader
        },
    };
    
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        res.send(body);
    });

}

// Company Data Update 
//
// Update a part of company data, such as erp_id.  
// hq/v1/accounts/:account_id/companies/:company_id
// https://developer.autodesk.com/en/docs/bim360/v1/reference/http/companies-:company_id-PATCH/
// 

exports.companyUpdate = function (req, res) {
    var body = req.body;
    var method = 'PATCH'; // body.method; 
    var account_id = body.account_id;
    var company_id = body.company_id; 
    var url = _baseUrl + 'hq/v1/accounts/' + account_id + '/companies/' + company_id;
    var data = body.newData; 
    
    var tokenHeader;
    if (req.session.token) {
        tokenHeader = 'Bearer ' + req.session.token;
    }
    
    var options = {
        method: method,
        url: url,
        headers: {
            'cache-control': 'no-cache',
            Authorization: tokenHeader,
            'Content-Type': 'application/json'
        },
        body: data 
    };
    
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        res.send(body);
    });

}
