# billable-hours
 <br/>
A a web application that accepts a timesheet (in csv format) as input and automatically generates invoices for each company
<br/>
<br/>
The API returns a file url, the file is a zip file that contains all the excel sheet invoices for all companies.<br/>
<br/>


The frontend: the csv file is uploaded and the zip file is downloaded.<br/>

##CI/CD
Travis CI is used, build status for branch master can be found above. 

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
