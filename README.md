Realtime Statistics
-------------------

Just a test of node.js and socket.io to create a real-time website statistics
dashboard using Apache combined logs. Originally created to monitor players
on [Wabble][].

  [wabble]: http://www.wabble.org/

How to use it
-------------

Run the server using node.js:

    node server/rtstats.js

It will listen on 8080 for HTTP connections and on 8081 for log file input.

On your webserver, pipe your Apache combined log file to the server's port 8081.
Note that if your node server and your Apache server are on different machines,
you might need to do some port forwarding gymnastics. Otherwise, netcat should
work nicely:

     tail -f /var/log/apache2/wabble.org/2011/05/04/access_log |nc localhost 8081

Finally, fire up your web browser (preferably one with websockets, like Chrome,
but socket.io figures out the transport for you, so it doesn't matter) and visit:

    http://localhost/rtstats.html

Note that it's not designed to be accessed via the Node webserver. It also uses
a simple PHP helper file to do DNS lookups, so PHP should be available, or you
can write a simple resolver in another language if you want.
