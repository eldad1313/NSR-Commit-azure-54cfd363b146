# Winner PPC by CommIT

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.24.

## Init   
Run `./init.sh`  
Init flow will install the global & local npm dependencies. 

## Development Server
Run `npm run serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.   
Rest api calls ('/api' prefix) will redirect to the QA server, as configured at 'proxy.conf.json' file.

## Build

Run `./build.sh` to build the project from scretch.   
build.sh will also install the global & local dependencies.  
   
Run `npm run build` to build the project (without installations).
* add base href: `npm run build -- --base-href=/path1/path2/`
Run `npm run build-css-path` to fix the css paths on production.   
  
Run `npm run build:prod` to build the project on production mode (minified)  
The build artifacts will be stored in the /dist directory.
  
## Development Server for Build  
   
Run `npm run serve-dist` to run a local server that will run the /dist directory.  
Rest api calls ('/api' prefix) will redirect to the QA server, as configured at 'Gruntfile.js' file.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Adding images

Run `npm run compass` to run a local server that will run compass:compile.
