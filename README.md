
# OR-Tool

The HiGHS Solver was integrated into the Single Page Application (SPA) to solve problems from the field of Operations Research (OR). The SPA makes it possible to solve various problems in LP format. In addition to the solution, the solution is also visualized


## Authors

- [@joschulz01](https://github.com/joschulz01)
- [@Fabiennepri](https://github.com/Fabiennepri)
- [@NadineArning](https://github.com/NadineArning)
- [@Christianvoss2002](https://github.com/Christianvoss2002)


## Run Locally (Angular CLI)

Clone the project

```bash
  https://github.com/joschulz01/programmierprojekt
```

Go to the project directory

```bash
  cd programmierprojekt
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  ng serve
```

## Run Locally (Docker)
Alternatively, docker can also be operated locally to run the Angular project
\
\
Clone the project
```bash
  https://github.com/joschulz01/programmierprojekt
```

Go to the project directory

```bash
  cd programmierprojekt
```

Build docker container

```bash
  docker build -t or-tool .
```

Run docker container

```bash
  docker run -p 8080:80 or-tool
```



## Tech Stack

**Client:** Angular

**Server:** Node


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Appendix

The project was created as part of a project at Osnabrück University of Applied Sciences. The project was carried out in the “Programming project” module

