#!/usr/bin/env node
    'use strict';

        var express  = require('express');
        var http     = require('http');
        var cheerio  = require('cheerio');

        var app      = express();

        app.get('*', function(req, res) {
            var url = req.query.url;
            // Prepared response
            var response = {
                'url': '',
                'status': '',
                'favicon': '',
                'rss': [],
                'title': '',
                'description': '',
                'picture': '',
            };

            if(url){
                // CRAWL GIVEN URL
                http.get(url, function(resp){
                    resp.setEncoding('utf8');
                    resp.on("data", function(html) {
                        // var $ = cheerio.load(html);
                        // $('meta').each(function(i, element){
                        //     console.log(element.content)
                        // });
                    });
                    res.statusCode = 200;
                    res.send(response);
                }).on('error', function(e){
                    console.log('Got error: '+ e.message);
                });
            }else{
                //BAD REQUEST
                res.statusCode = 400;
                res.send("URL is missing in Request");
            }
        });

    app.listen(8080);

    console.log('Server started on port 8080');
