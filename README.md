
tcpipe
------

Simple command line TCP proxy with statistics report!


Usage
-----

```bash
tcpipe 80 8080
```

Forwards port 80 to port 8080.


```bash
tcpipe 127.0.0.1:2222 169.254.123.45:22
```

Redirects SSH traffic from 127.0.0.1 to a remote machine 169.254.123.45:22.
This is useful for SSHing into a computer where IP usually changes.

