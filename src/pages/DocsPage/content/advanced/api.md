---
title: API
---

This is work in progress documentation for the private API on https://2anki.net/api. Documenting it is part of opening up the API
for third-party users and making it public

Unless otherwise specified in the description endpoints requires authentication.

Note that get requests to pages that require authentication will be handled in the middleware  
or client side depending on requirements but listing them below also.

GET /search\*
-------------

TODO

GET /api/uploads\*'
-------------------

TODO

GET /
-----

TODO

GET /checks
-----------

Used for health checks. Returns status code 200 with string `Notion to Anki`. OpenBlue

GET /download/u/:key
--------------------

Where `key` is a string corresponding to a file in our bucket. This returns binary data or error.

POST /favorite/create
---------------------

Creates a new favorite from body with `object_id`, `type` and `owner`.

DELETE /favorite/remove
-----------------------

Deletes a favorite using `object_id` and `owner`.

GET /favorite
-------------

Returns list of favorites for the current user. Note that we are also making request to the Notion API here to get metadata for the favorite.

GET /connect
------------

Endpoint for establishing a connection to Notion. We need a token for this. On error and success you get redirected to `/search`.

Reference: [https://developers.notion.so/](https://developers.notion.so/)

* * *

POST /pages
-----------

TODO

GET /get-notion-link
--------------------

TODO

POST /convert/
--------------

TODO

GET /notion/page/:id
--------------------

TODO

GET /notion/blocks/:id
----------------------

TODO

GET /notion/block/:id
---------------------

TODO

POST /notion/block/:id
----------------------

TODO

DELETE /notion/block/:id
------------------------

TODO

GET /notion/render-block/:id
----------------------------

TODO

GET /notion/database/:id
------------------------

TODO

GET /notion/database/query/:id
------------------------------

TODO

GET /rules/find/:id
-------------------

TODO

POST /rules/create/:id
----------------------

TODO

POST /settings/create/:id
-------------------------

TODO

POST /settings/delete/:id
-------------------------

TODO, change to DELETE method

GET /settings/find/:id
----------------------

TODO

POST /templates/create
----------------------

TODO

POST /templates/delete
----------------------

TODO

POST '/upload/file
------------------

TODO

GET /upload/mine
----------------

TODO

GET /upload/jobs
----------------

TODO

DELETE /upload/jobs/:id
-----------------------

TODO

DELETE /upload/mine/:key
------------------------

TODO

POST /users/new-password
------------------------

TODO

POST /users/forgot-password
---------------------------

TODO

POST /users/logout
------------------

TODO

POST /users/login
-----------------

TODO

POST /users/register
--------------------

TODO

GET /users/r/:id
----------------

TODO

GET /users/debug/locals
-----------------------

TODO

POST /users/delete-account
--------------------------

TODO