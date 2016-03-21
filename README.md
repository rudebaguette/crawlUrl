# Url Crawler

GET request
    parameters:
    - url, the url you want to fetch

response:
{
    url: final URL
    status: HTTP status code
    favicon: favicon url
    rss: [] rss url
    title: og page title || page title
    description: og page description || page description
    picture: og page picture
}
