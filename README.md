# Random Background

A simple web server that serves a random image on every request

# Running

## With Docker

A simple example using docker-compose

1. Create a `data` directory and place your images there
2. Create a `docker-compose.yml` with the following content:
```yml
version: '3'
services:
  random-background:
    image: dumbaspl/random-background
    restart: unless-stopped
    volumes:
      # Container expects images to be in /data
      # this can be changed using the DATA_DIR environment variable
      # or by using an S3 compatible storage
      - ./data:/data
    ports:
      # Expose on port 3000, you might need to change this
      - 3000:3000
```
3. start the container using `docker-compose up -d`

## Locally

You need nodejs(LTS version recommended) and yarn installed

1. Create a `data` directory and place your images there
2. Create a .env file and put your configuration there.
```env
DATA_DIR=./data
```
Set DATA_DIR to the directory you created in step 1 or configure S3

3. Install dependencies using `yarn`
4. Build using `yarn build`
5. Start by running `node dist/index.js`

## Using S3 compatible storage instead of a local folder

to use S3 compatible storage you need to set the following environment variables:

| Name           | Required                                       |
|----------------|------------------------------------------------|
| S3_ENDPOINT    | Yes                                            |
| S3_PORT        | Yes                                            |
| S3_USE_SSL     | No (Defaults to false, set to true to enable)  |
| S3_ACCESS_KEY  | Yes                                            |
| S3_SECRET_KEY  | Yes                                            |
| S3_BUCKET_NAME | Yes (Will be created if bucket does not exist) |
| S3_REGION      | No (Defaults to us-east-1)                     |

NOTE: if `S3_ENDPOINT` is set `DATA_DIR` is ignored

# Available endpoints

the `:path` is relative to `DATA_DIR`. It can be omitted if images are in the root of `DATA_DIR`. 

`/` - redirects to `/direct`

`/b` - redirects to `/redirect`

`/direct/:path` - returns a random image from selected path without redirecting. Do not cache this endpoint!

`/redirect/:path` - picks a random image and redirects to `/img/:path/<random image>`

`/img/:fullImagePath` - gets an image directly. Usefully if you want to add a cache in front of this service