### Docker setup
Create Docker image with (will also build app):  
`docker build -t plexhelp-front .`

Run image with:  
`docker run -p 8888:80 --name front plexhelp-front:latest`