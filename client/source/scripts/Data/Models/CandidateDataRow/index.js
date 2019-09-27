import DataRow from "../DataRow";
import DataField from "../DataField";
import {FieldValidator, ValidationRule} from "../FieldValidator";

class CandidateDataRow extends DataRow{
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
        this.addField(new DataField("Id", "number", data["Id"], true));
        this.addField(new DataField("UserId", "number", data["UserId"], false));
        this.addField(new DataField("Name", "string", data["Name"], false));
        this.addField(new DataField("Address", "string", data["Address"], false));
        this.addField(new DataField("City", "string", data["City"], false));
        this.addField(new DataField("State", "string", data["State"], false));
        this.addField(new DataField("PostalCode", "string", data["PostalCode"], false));
        this.addField(new DataField("Country", "string", data["Country"], false));
        this.addField(new DataField("Phone", "string", data["Phone"], false));
        this.addField(new DataField("Email", "string", data["Email"], false));
        this.addField(new DataField("Status", "string", data["Status"], false));
        this.addField(new DataField("DateOfBirth", "number", data["DateOfBirth"], false));
        this.addField(new DataField("Created", "string", data["Created"], false));
    }

    addValidation(){
        this.validators["Id"] = new FieldValidator();
        this.validators["UserId"] = new FieldValidator();
        this.validators["Name"] = new FieldValidator();
        this.validators["Address"] = new FieldValidator();
        this.validators["City"] = new FieldValidator();
        this.validators["State"] = new FieldValidator();
        this.validators["PostalCode"] = new FieldValidator();
        this.validators["Country"] = new FieldValidator();
        this.validators["Phone"] = new FieldValidator();
        this.validators["Email"] = new FieldValidator();
        this.validators["Status"] = new FieldValidator();
        this.validators["DateOfBirth"] = new FieldValidator();
        this.validators["Created"] = new FieldValidator();

        this.validators["Id"].addRule(new ValidationRule("required", true, "Required field."));

        this.validators["Name"].addRule(
            new ValidationRule("minlength",4,"Requires more than 5 characters."));

        this.validators["Name"].addRule(
            new ValidationRule("maxlength",50,"Requires less than 50 characters."));

        this.validators["Address"].addRule(
            new ValidationRule("maxlength",25,"Requires less than 25 characters."));

        this.validators["City"].addRule(
            new ValidationRule("maxlength",25,"Requires less than 25 characters."));

        this.validators["State"].addRule(
            new ValidationRule("maxlength",25,"Requires less than 25 characters."));

        this.validators["PostalCode"].addRule(
            new ValidationRule("maxlength",25,"Requires less than 25 characters."));

        this.validators["Phone"].addRule(
            new ValidationRule("maxlength",25,"Requires less than 25 characters."));

        this.validators["Email"].addRule(
            new ValidationRule("maxlength",100,"Requires less than 100 characters."));

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

export default CandidateDataRow;