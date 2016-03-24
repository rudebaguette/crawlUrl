#!/usr/bin/env node
'use strict';

var express  = require('express');
var request = require('request');
var cheerio  = require('cheerio');
var NodeCache = require( "node-cache" );
var url_paser = require('url');
var cors = require('cors');
var app      = express();

var extract_meta = function($, metas){
    var response = {
        'url': '',
        'status': '',
        'favicon': '',
        'rss': [],
        'title': '',
        'description': '',
        'picture': '',
        'oembed': {}
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

var clean_url = function(url){
    if(!/^http/.exec(url)){
        return 'http://'+url;
    }
    return url;
};

var myCache = new NodeCache();

app.use(cors());

var get_cache_key = function(request){
    return (request.query.maxwidth || '') + request.query.url;
};

app.get('*', function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var url = req.query.url;
    var metas = {
        'title': ['meta[property="og:title"]', 'title'],
        'description': ['meta[property="og:description"]', 'description'],
        'picture': ['meta[property="og:image"]','meta[property="twitter:image"]'],
    };

    if(url){
        // Log Activity
        console.log("Request from: "+ ip + " for: " + req.originalUrl);

        // Clean URL
        url = clean_url(url);

        var cache_key = get_cache_key(req);

        // Checking for cache
        myCache.get(cache_key, function(err, value){
            if( !err ){
                if(value){
                    res.statusCode = 200;
                    res.send(value);
                }else{
                    // [HTTP] CRAWL GIVEN URL
                    request(url, function(error, resp, body){

                        if(!error && resp.statusCode === 200){
                            var $ = cheerio.load(body);

                            // Find openGraph metas
                            var response = extract_meta($, metas);

                            // Find every rss and associated title in the metas
                            response.rss = extract_rss($);

                            response.url = clean_url(resp.request.uri.href);

                            //Extract favicon or return Host/favicon.ico
                            response.favicon = clean_url(extract_favicon($, response.url));

                            //Extract oEmbed
                            var links = $('link[type="application/json+oembed"]');
                            if(links.length === 1){
                                var maxwidth = req.query.maxwidth;
                                var oembed_url = links[0].attribs.href;
                                if (maxwidth){
                                    oembed_url += '&maxwidth=600';
                                }
                                request(oembed_url, function(error, resp, body){
                                    response.oembed = JSON.parse(body);
                                    response.status = 200;
                                    res.statusCode = 200;
                                    // Set cache
                                    myCache.set(url, response, 172800);
                                    res.send(response);
                                });
                            }else{
                                response.status = 200;
                                res.statusCode = 200;
                                // Set cache
                                myCache.set(cache_key, response, 172800);
                                res.send(response);
                            }
                        }else{
                            var err = {
                                'error': 'Invalid URI: '+url
                            };
                            if(resp){
                                err.status = resp.statusCode;
                            }
                            console.log(error);
                            res.statusCode = 400;
                            res.send(err);
                        }
                    });
                }
            }
        });
    }else{
        //BAD REQUEST
        res.statusCode = 400;
        res.send({'error': "URL is missing in Request"});
    }
});

app.listen(8080);

console.log('Server started on port 8080');
