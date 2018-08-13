# Angular Single Page Application
## Overview

* Single Page Application (SPA) was built with **Angular 5** and **TypeScript**
* For authentication and authorization app uses **Auth0**

This is a simple application created for training purposes. I have built an **Employee Management System API** for a fictitious company named **TutorialCo**. Only authorized users can call the endpoints on my API. For this purposes is used the [OAuth 2.0 authorization framework](https://tools.ietf.org/html/rfc6749). When a user wants to access protected endpoints on an API, he needs to present an **Access Token** as proof that he has the required permissions (scopes) for making the call to the endpoint. Each Access Token contains a list of authorized scopes. API includes 4 levels of authorization:

* reading emloyees (scope: *read:employees*);
* creating employees (scope: *create:employees*);
* editting employees (scope: *edit:employees*);
* deleting employees (scope: *delete:employees*).
         
The application is used by two types of users (**Admin and Guest**) with different permissions. Roles and permissions configured with the [Auth0 Authorization Extension](https://auth0.com/docs/extensions/authorization-extension/v2). The admin's access token should include *create, edit and delete* scopes and guest should have token only with the *read* scope.

To add information about a user roles to an access token and to validate token scopes, app uses [Rules](https://auth0.com/docs/rules/current)

## Implementation
This folder includes the Single Page Application (SPA) implementation using [Angular](https://angular.io)

## Prerequisites
* Auth0 account
* [Authorization Extension](https://auth0.com/docs/extensions/authorization-extension/v2)
* [Node Package Manager (NPM)](https://docs.npmjs.com/cli/version)
* [Package Manager For The Web (Bower)](https://bower.io)

## Set the configuration values

Rename the *auth0Variables.ts.example* file in the src/client/app/auth folder to *auth0Variables.ts* Once you have renamed the file you should set the following values in your new auth0Variables.ts file:

* `{DOMAIN}` : Set this to the value of your **Auth0 Domain**. You can retrieve it from the *Settings* of your Client at the [Auth0 Dashboard](https://auth0.com/docs/dashboard)
* `{CLIENT_ID}`: Set this to the value for your **Auth0 Client**. You can retrieve it from the *Settings* of your Client at the [Auth0 Dashboard](https://auth0.com/docs/dashboard).

Necessary [Rules](https://auth0.com/docs/rules/current) are stored in the **rules** folder 

## Deploy & Run

To test this application, you should run the corresponding API. For instructions on how to configure and run the API please see the [README.md]()

Once the API is running, you can open a terminal window to the folder in which this README.md is and install the required packages for the Angular SPA by running: 

* ```npm install```
* ```bower install```

To run the Angular app:

* ```npm start```

The application will be served at http://localhost:3000.

To run tests of this application:

* ```npm run tests``` 

      
