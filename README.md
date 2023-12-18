# गोथम

This documentation for now is only for dashboard.

## <u>Installation</u>

`npm i`

This will install the dependencies and prepare your system, then simply `npm run start` to view the app.

Project file structure.

Each major module is included within its folder.

## <u> File Structuring </u>

The project directory are adjusted as following.

### <u>component</u>

Includes the re-usable components that are distributed throughout the system.
It is highly encouraged to use stand-alone components so we don't overload the ngModule file. **Go to your project's base folder to use angular CLI.**

`ng g c 'components/{yourComponent}' --standalone`

### <u> pages </u>

This is regular component of angular without using standalone, this component acts as a page and should be included in routing.module.ts for navigation. Spend sometime in deciding whether you're buidling a component or a page.

`ng g c 'pages/{pageName}'`

### <u> directives </u>

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### <u>interfaces</u>

### <u> pipes</u>

### <u> services</u>

### <u> utils</u>

Handy service directory that serves as tool kit for basic ops. Stuff related to time, some UI rendering subjects etc are tied down here to make them less noist.

## Run

Check pagckage.json to see what projects are avialable.
use `npm run start:dash` to run dashboard.

## Build

user `npm run build:dash` to build dashboard.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
