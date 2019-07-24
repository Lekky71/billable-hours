# billable-hours
 <br/>
A a web application that accepts a timesheet (in csv format) as input and automatically generates invoices for each company


To start api  
 <br/>
 `npm install` 
 <br/>
 <br/>
`npm start`  
 <br/>
 Testing
  <br/>
  <br/>
 `npm install -g mocha`  
  <br/>
 `npm run test`    
 <br/>
 Full API Documentation is available on Postman via this [link](https://www.getpostman.com/collections/b37852ab8933dcb2420f).

## Codebase Structure
<pre>
billable-hours/
├── README.md
├── app
│   ├── config
│   │   ├── di.js
│   │   └── settings.js
│   ├── constants
│   │   └── httpStatus.js
│   ├── controllers
│   │   └── bill.controller.js
│   ├── index.js
│   ├── lib
│   │   ├── responseManager.js
│   │   └── serviceLocator.js
│   ├── models
│   ├── route
│   │   └── route.js
│   ├── service
│   │   └── bill.service.js
│   └── tests
│       └── bill.test.js
├── package.json
└── sample.env

</pre>
