
# OR-Tool

The HiGHS Solver was integrated into the Single Page Application (SPA) to solve problems from the field of Operations Research (OR). The SPA makes it possible to solve various problems in LP format. In addition to the solution, the solution is also visualized


## Authors

- [@joschulz01](https://github.com/joschulz01)
- [@Fabiennepri](https://github.com/Fabiennepri)
- [@NadineArning](https://github.com/NadineArning)
- [@Christianvoss2002](https://github.com/Christianvoss2002)

## Demo

If you would like to take a look at the entire project, you can do so on our website [or-tool.de](https://or-tool.de)

## Run Locally (Angular CLI)
To use the website locally, make sure that [Node.JS](https://nodejs.org/en) is installed and the [Angular CLI](https://www.npmjs.com/package/@angular/cli) is installed

1. Clone the project

```bash
  https://github.com/joschulz01/programmierprojekt
```

2. Go to the project directory

```bash
  cd programmierprojekt
```

3. Install dependencies

```bash
  npm install
```

4. Start the server

```bash
  ng serve
```

## Run Locally (Docker)
Alternatively, Docker can also be operated locally to run the Angular project. Please make sure that [Docker](https://www.docker.com/) is installed

1. Clone the project
```bash
  https://github.com/joschulz01/programmierprojekt
```

2. Go to the project directory

```bash
  cd programmierprojekt
```

3. Build Docker container

```bash
  docker build -t or-tool .
```

4. Run Docker container

```bash
  docker run -p 8080:80 or-tool
```
## Run Test Local

The Robot Framework was used for testing. If you are interested, this can also be executed locally. Make sure that [Python](https://www.python.org/) is installed. The Python package “Tkinter” is normally installed by default. However, if error messages still occur, the package must be installed later using the command ```sudo apt-get install python3-tk```

1. Clone the project

```bash
  https://github.com/joschulz01/programmierprojekt
```

2. Go to the project directory

```bash
  cd programmierprojekt
```

3. Install Robot Framework

```bash
  pip install robotframework
```

4. Install Robot Framework Browser Library
```bash
pip install robotframework-browser
```

5. Init Robot Framework
```bash
rfbrowser init
```

6. Run Robot Framework Local
```bash
robot Test.robot
```

## Tech Stack

**Client:** Angular, Docker, Python

**Server:** Node.JS


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Appendix

The project was created as part of a project at Osnabrück University of Applied Sciences. The project was carried out in the “Programming project” module

