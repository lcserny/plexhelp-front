### Docker setup
Create Docker image with (will also build app):  
`docker build -t plexhelp-front .`

Run image with:  
`docker run -p 8888:80 --name front plexhelp-front:latest`

### Build and install
Run provided `./install.sh` file.  
It will build a new frontend, clean the currently used frontend and install the new built frontend in its place.  

### Generating Typescript model classes from OpenApi spec
`npm run specgen`