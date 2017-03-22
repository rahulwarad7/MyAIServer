var Customer = require('./../../../shared/data-models/customer.js');
var Address  = require('./../../../shared/data-models/address.js');


function UIRenters(){
    this.primaryAddrInfo = new Address();
    this.customerInfo = new Customer();
    this.insuredAddrInfo = new Address();
    this.IsInsuredAddrSame = false;
}