function Resident(){
    this.residentGuid=null;
    this.residentNumber=0;
    this.firstName=null;
    this.middleName=null;
    this.lastName=null;
    this.suffix=null;
    this.gender=null;
    this.relationToPrimary=null;
    this.age=null;
    this.employmentStatus=null;
    this.maritalStatus=null;
    this.isSpouse=false;
    this.isPrimary=false;
    this.isPrefilled=false;
    this.hasEmploymentStatus=false;
    this.dateOfBirth=null;
    this.socialSecurityNumber=null;
    this.isProvidingSSN=false;
}

module.exports = Resident;
