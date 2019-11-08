import DataRow from "../DataRow";
import DataField from "../DataField";
import {FieldValidator, ValidationRule} from "../FieldValidator";

class UserDataRow extends DataRow{
    validators = [];

    constructor(data){
        super();

        this.addValidation = this.addValidation.bind(this);
        this.addFields = this.addFields.bind(this);
        this.validate = this.validate.bind(this);

        this.addFields(data);
        this.addValidation();
    }

    addFields(data){
        this.addField(new DataField("UserId", "number", data["UserId"], true));
        this.addField(new DataField("UserLogin", "string", data["UserLogin"], false));
        this.addField(new DataField("FirstName", "string", data["FirstName"], false));
        this.addField(new DataField("LastName", "string", data["LastName"], false));
        this.addField(new DataField("Email", "string", data["Email"], false));
        this.addField(new DataField("RoleName", "string", data["RoleName"], false));
        this.addField(new DataField("RoleId", "number", data["RoleId"], false));
        this.addField(new DataField("EntityId", "number", data["EntityId"], false));
        this.addField(new DataField("EntityName", "string", data["EntityName"], false));

    }

    addValidation(){
        this.validators["UserId"] = new FieldValidator();
        this.validators["UserLogin"] = new FieldValidator();
        this.validators["FirstName"] = new FieldValidator();
        this.validators["LastName"] = new FieldValidator();
        this.validators["Email"] = new FieldValidator();
        this.validators["RoleName"] = new FieldValidator();

        this.validators["UserId"].addRule(new ValidationRule("required", true, "Required field."));

        this.validators["UserLogin"].addRule(
            new ValidationRule("minlength",4,"Requires more than 5 characters."));

        this.validators["UserLogin"].addRule(
            new ValidationRule("maxlength",50,"Requires less than 50 characters."));

        this.validators["FirstName"].addRule(
            new ValidationRule("maxlength",50,"Requires less than 50 characters."));

        this.validators["LastName"].addRule(
            new ValidationRule("maxlength",50,"Requires less than 50 characters."));

        this.validators["Email"].addRule(
            new ValidationRule("minlength",5,"Requires more than 5 characters."));

        this.validators["Email"].addRule(
            new ValidationRule("maxlength",100,"Requires less than 50 characters."));

        this.validators["RoleName"].addRule(
            new ValidationRule("maxlength",50,"Requires less than 50 characters."));

    }

    validate(){
        let isValid = true;

        for(let key of Object.keys(this.fields)){
            const f = this.fields[key];
            const name = f.getName();

            if(this.validators[name]) {
                if(!this.validators[name].validate(f)){
                    isValid = false;
                }

            }
        }

        if(this.rowChangeHandler)
            this.rowChangeHandler(this, null);

        return isValid;
    }

    validateField(fieldName){
        let isValid = true;

        const f = this.fields[fieldName];

        if(this.validators[fieldName]) {
            if(!this.validators[fieldName].validate(f)){
                isValid = false;
            }
        }

        if(this.rowChangeHandler)
            this.rowChangeHandler(this, null);

        return isValid;
    }
}

export default UserDataRow;