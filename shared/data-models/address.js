function Address(){
    this.addressLine1='';
    this.aptOrUnit='';
    this.city='';
    this.state='';
    this.zipCode='';
    this.addressType='';
    this.standardizationCodes=null;
    this.invalidAddress=false;   
}


module.exports = Address;
