# Attendees

An example app to show Transit. It requires Node with Harmony support.
Only development version support Harmony at the moment, e.g.
[0.11.14](http://blog.nodejs.org/2014/09/24/node-v0-11-14-unstable/).


## Presentation

Filip Zrůst - Transferring application data efficiently with Transit: https://speakerdeck.com/frzng/transferring-application-data-efficiently-with-transit


## Usage


### Get the project

```bash
git clone git@github.com:frzng/attendees.git
```


### Go at the beginning

See the simple app with pure JSON REST API:

```bash
git checkout step-1-simple
```

Check the source code of
[index.js](https://github.com/frzng/attendees/blob/step-1-simple/index.js)
and try it yourself. Run the app in one terminal:

```bash
npm install
npm start
```

And test it in other terminal. Get list of all attendees:

```bash
curl -s localhost:3000/attendees
```
```javascript
[]
```

Add a new attendee:

```bash
curl -i -H 'Content-Type: application/json' -d '{ "email": "frzng@me.com", "name": "Filip Zrůst" }' localhost:3000/attendees
```
```http
HTTP/1.1 201 Created
Location: /attendees/0

```

Get list of all attendees again:

```bash
curl -s localhost:3000/attendees
```
```javascript
[{
  "email" : "frzng@me.com",
  "name" : "Filip Zrůst"
}]
```

You should have a clear understanding of we're trying to achieve.
Storing data in global variable (not persistent). Data are attendee
records with `email` and `name` keys.


### Transit in action

Now with Transit:

```bash
git checkout step-2-transit
```

Compare
[changes from step 1 to step 2](https://github.com/frzng/attendees/compare/step-1-simple...step-2-transit?diff=split).
and try it yourself. Run the app in one terminal:

```bash
npm install
npm start
```

And test it in other terminal. Get list of all attendees:

```bash
curl -s localhost:3000/attendees
```
```javascript
[[
  "^ ",
  "~:name", "Filip Zrůst",
  "~:email", "~rmailto:frzng@me.com"
], [
  "^ ",
  "^0", "Stojan Jakotyč",
  "^1", "~rmailto:sj@example.com"
]]
```

See how plain JavaScript object (i.e., `map` Transit semantic type)
gets encoded to JSON `array` element with the `"^ "` tag indicating
that it is in fact a map. You can also scalar elements with `:` and
`r` tags for `keyword` and `URI` respectively.

Also notice how caching works for map keys.

*Note*: This step doesn't properly support `create` and `update`
 actions. This is because `co-body` should be replaced with Transit
 reader.


### Custom types in action

Now with custom composite type writer for `Attendee` record:

```bash
git checkout step-3-custom
```

Compare
[changes from step 2 to step 3](https://github.com/frzng/attendees/compare/step-2-transit...step-3-custom?diff=split).
and try it yourself. Run the app in one terminal:

```bash
npm start
```

And test it in other terminal. Get list of all attendees:

```bash
curl -s localhost:3000/attendees
```
```javascript
[[
  "~#att", [
    "^ ",
    "~:name", "Filip Zrůst",
    "~:email", "~rmailto:frzng@me.com"
  ]
], [
  "^0", [
    "^ ",
    "^1", "Stojan Jakotyč",
    "^2", "~rmailto:sj@example.com"
  ]
]]
```

See the custom tag `att` for composite element and that even the tag
gets cached (if it is longer than three characters).

*Note*: This step doesn't properly support `create` and `update`
 actions. This is because `co-body` should be replaced with Transit
 reader.


### Add and modify attendees

Now with custom composite type reader for `Attendee` record:

```bash
git checkout step-4-reader
```

Compare
[changes from step 3 to step 4](https://github.com/frzng/attendees/compare/step-3-custom...step-4-reader?diff=split).
and try it yourself. Run the app in one terminal:

```bash
npm install
npm prune
npm start
```

And test it in other terminal. Get list of all attendees:

```bash
curl -s localhost:3000/attendees
```
```javascript
[[
  "~#att", [
    "^ ",
    "~:name", "Filip Zrůst",
    "~:email", "~rmailto:frzng@me.com"
  ]
], [
  "^0", [
    "^ ",
    "^1", "Stojan Jakotyč",
    "^2", "~rmailto:sj@example.com"
  ]
]]
```

Add a new attendee:

```bash
curl -i -H 'Content-Type: application/transit+json' -d '[ "~#att", [ "^ ", "~:name", "Tomáš Marný", "~:email", "~rmailto:sj@example.com" ] ]' localhost:3000/attendees
```
```http
HTTP/1.1 201 Created
Location: /attendees/0

```

Get list of all attendees again:

```bash
curl -s localhost:3000/attendees
```
```javascript
[[
  "~#att", [
    "^ ",
    "~:name", "Filip Zrůst",
    "~:email", "~rmailto:frzng@me.com"
  ]
], [
  "^0", [
    "^ ",
    "^1", "Stojan Jakotyč",
    "^2", "~rmailto:sj@example.com"
  ]
], [
  "^0", [
    "^ ",
    "^1", "Tomáš Marný",
    "^2", "~rmailto:sj@example.com"
  ]
]]
```
