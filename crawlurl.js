#!/usr/bin/env node
    'use strict';

        var express  = require('express');
        var http     = require('http');
        var https     = require('https');
        var cheerio  = require('cheerio');
        var NodeCache = require( "node-cache" );
        var url_paser = require('url');
        var app      = express();

        // Prepared response


        var extract_meta = function($, metas){
            var response = {
                'url': '',
                'status': '',
                'favicon': '',
                'rss': [],
                'title': '',
                'description': '',
                'picture': '',
                'oembed': []
            };
            for(var key in metas){
                var meta = $(metas[key].join(','));
                if (meta.length) {
                    response[key] = meta[0].attribs.content || meta.eq(0).text();
                }
            }
            return response;
        };

        var extract_rss = function($){
            var rss = [];
            var links = $('link[type="application/rss+xml"]');
            for(var i=0; i<links.length; i++){
                rss.push({'title': links[i].attribs.title , 'href': links[i].attribs.href});
            }
            return rss;
        };

        var extract_favicon = function($, url){
            var favicon = '';
            var links = $('link[type="image/x-icon"]');
            if(links.length > 0){
                for(var i=0; i<links.length; i++){
                    favicon = links[i].attribs.href;
                }
                return favicon;
            }else{
                return url_paser.parse(url).host + '/favicon.ico';
            }
        };

        var get_http_lib = function(url){
            var lib = http;
            if(url_paser.parse(url).protocol === 'https:'){
                lib = https;
            }
            return lib;
        };

        app.get('*', function(req, res) {
            var myCache = new NodeCache();
            var url = req.query.url;
            var html = '';
            var metas = {
                'title': ['meta[property="og:title"]', 'title'],
                'description': ['meta[property="og:description"]', 'description'],
                'picture': ['meta[property="og:image"]','meta[property="twitter:image"]'],
                'url': ['meta[property="og:url"]']
            };

            if(url){
                // Checking for cache

                    // [HTTP] CRAWL GIVEN URL
                    get_http_lib(url).get(url, function(resp){

                        resp.setEncoding('utf8');
                        resp.on("data", function(chunk) {
                            html += chunk;
                        });
                        resp.on("end", function(){
                            var $ = cheerio.load(html);

                            // Find openGraph metas
                            var response = extract_meta($, metas);

                            // Find every rss and associated title in the metas
                            response.rss = extract_rss($);

                            //Extract favicon or return Host/favicon.ico
                            response.favicon = extract_favicon($, url);

                            //Extract oEmbed
                            var links = $('link[type="application/json+oembed"]');
                            if(links.length === 1){
                                var json = '';
                                get_http_lib(links[0].attribs.href).get(links[0].attribs.href, function(resp){
                                    resp.on("data", function(chunk) {
                                        json += chunk;
                                    });
                                    resp.on("end", function(){
                                        response.oembed = JSON.parse(json);
                                        response.status = 200;
                                        // Set cache
                                        res.statusCode = 200;
                                        res.send(response);
                                    });
                                });
                            }

                        });
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
