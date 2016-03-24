# Url Crawler
---

GET request:
    <br>Parameters:
    <br>- url, the url you want to fetch

<br>Response: <br>
```json
{
    url: "Final Url",
    status: "HTTP Status Code",
    favicon: "Favicon Url",
    rss: "List of RSS Url",
    title: "OG Page <title> or Page <title>",
    description: "OG Page <description> or Page <description>",
    picture: "OG Page picture",
    oembed: "Oembed Object",
}
```

<br> Reponse for a Youtube video: <br>

```json
{
    "url": "https://www.youtube.com/watch?v=r_xJK8Q9e9o",
    "status": 200,
    "favicon": "https://s.ytimg.com/yts/img/favicon-vflz7uhzw.ico",
    "rss": [0],
    "title": "#ParisFounders Event New York Special Edition - YouTube",
    "description": "Check out a glimpse of our #ParisFounders New York Special Edition. Video by VRTUOZ. http://paris.foundersevent.com About #ParisFounders: FRANCE’S LARGEST S...",
    "picture": "https://i.ytimg.com/vi/r_xJK8Q9e9o/hqdefault.jpg",
    "oembed": {
        "html": "<iframe width="480" height="270" src="https://www.youtube.com/embed/r_xJK8Q9e9o?feature=oembed" frameborder="0" allowfullscreen></iframe>",
        "thumbnail_height": 360,
        "author_url": "https://www.youtube.com/channel/UCweZMqq2va1loyRDekcWfDw",
        "provider_name": "YouTube",
        "height": 270,
        "provider_url": "https://www.youtube.com/",
        "thumbnail_url": "https://i.ytimg.com/vi/r_xJK8Q9e9o/hqdefault.jpg",
        "author_name": "Rude Baguette",
        "type": "video",
        "width": 480,
        "version": "1.0",
        "title": "#ParisFounders Event New York Special Edition",
        "thumbnail_width": 480,
    }
}
```

<br> Reponse for an news article: <br>

```json
{
    "url": "http://www.rudebaguette.com/2016/03/19/gdc-2016-ou-est-lafrenchtech/",
    "status": 200,
    "favicon": "www.rudebaguette.com/favicon.ico",
    "rss": [
        {
            "title": "Rude Baguette Feed",
            "href": "http://www.rudebaguette.com/feed/",
        },
    ],
    "title": "GDC 2016: Où est LaFrenchTech ?",
    "description": "The debate on the value of holding country pavilions at large tech conferences has merit. Whatever your views on the topic may be, France was conspicuously",
    "picture": "http://www.rudebaguette.com/assets/gdc_2016_pays.jpg",
    "oembed": {},
}
```
