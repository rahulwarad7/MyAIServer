function Customer(){
    this.firstName;
    this.lastName;
    this.middleName;
    this.dob;
}

Customer.prototype.getFullName = function(customerInfo){
    return customerInfo.firstName + " " + customerInfo.lastName;
};

module.exports = Customer;