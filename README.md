# API Documentation
Sample project
## Endpoints
### GET /api/categories
List of all categories
#### Parameters
None
#### Responses
##### 200 OK!
Response example:
```
[
    {
        "id": 13,
        "title": "Sem json e com token errado",
        "slug": "sem-json-e-com-token-errado",
        "createdAt": "2021-03-18T11:20:17.000Z",
        "updatedAt": "2021-03-18T11:20:17.000Z"
    },
    {
        "id": 12,
        "title": "Sem json",
        "slug": "sem-json",
        "createdAt": "2021-03-18T10:58:40.000Z",
        "updatedAt": "2021-03-18T10:58:40.000Z"
    },
    {
        "id": 11,
        "title": "Axios is great!",
        "slug": "axios-is-great!",
        "createdAt": "2021-03-17T20:25:35.000Z",
        "updatedAt": "2021-03-17T20:25:35.000Z"
    },
    {
        "id": 9,
        "title": "Web development",
        "slug": "web-development",
        "createdAt": "2021-03-17T20:06:28.000Z",
        "updatedAt": "2021-03-17T20:06:28.000Z"
    },
    {
        "id": 2,
        "title": "API Rest with Nodejs and Axios",
        "slug": "api-rest-with-nodejs-and-axios",
        "createdAt": "2021-03-13T16:04:19.000Z",
        "updatedAt": "2021-03-17T22:21:28.000Z"
    }
]
```

##### 401 Authentication failure!
Response example:
```
{
    "err": "Invalid token!"
}
```
And so on....
