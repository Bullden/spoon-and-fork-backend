**Generate self signed certificates**

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout private-key.pem -out public-certificate.pem`
