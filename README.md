
# Minecraft Instances Manager API

This is Minecraft Instances Manager API.It can manage so many Instances with API




## How to build

To Run this api.You must Install Node Js and follow this step

```bash
  npm install

```
Config .env file
```env
  PORT = YOUR PORT
```
Run this api
```bash
  node server.js
```

## Usage
To request API. This is example to request API

create Instance (POST*)
```json
  {
    "name": "minecraft",
    "version": "1_21"
}
```
```links
  http://192.168.1.123:3330/api/createins
```
TO start or stop (POST*)
```json
  {
    "name": "minecraft",
    "version": "1_21"
}
```
```links
  http://192.168.1.123:3330/api/startins
  http://192.168.1.123:3330/api/stopins
```
TO delete Instance (DELETE*)
```json
  {
    "name": "minecraft",
    "version": "1_21"
}
```
```links
  http://192.168.1.123:3330/api/deleteins
```
TO get Instance list (GET*)
```json
  {
    "name": "minecraft",
    "version": "1_21"
}
```
```links
  http://192.168.1.123:3330/api/getinstance
```
To Get Status of Instance (GET*)
```json
  {
    "name": "minecraft",
    "version": "1_21"
}
```
```links
  http://192.168.1.123:3330/api/status
```

## NOTE
'*' This is method to request api
