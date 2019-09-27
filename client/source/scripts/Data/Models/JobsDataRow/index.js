import DataRow from "../DataRow";
import DataField from "../DataField";
import {FieldValidator, ValidationRule} from "../FieldValidator";

class JobsDataRow extends DataRow{
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
        this.addField(new DataField("AgencyId", "number", data["AgencyId"], false));
        this.addField(new DataField("CategoryId", "number", data["CategoryId"], false));
        this.addField(new DataField("Title", "string", data["Title"], false));
        this.addField(new DataField("Category", "string", data["Category"], false, true));
        this.addField(new DataField("Location", "string", data["Location"], false));
        this.addField(new DataField("Status", "string", data["Status"], false));
        this.addField(new DataField("Created", "string", data["Created"], false));
    }

    addValidation(){
        this.validators["Id"] = new FieldValidator();
        this.validators["AgencyId"] = new FieldValidator();
        this.validators["CategoryId"] = new FieldValidator();
        this.validators["Title"] = new FieldValidator();
        this.validators["Category"] = new FieldValidator();
        this.validators["Location"] = new FieldValidator();
        this.validators["Status"] = new FieldValidator();
        this.validators["Created"] = new FieldValidator();

        this.validators["Id"].addRule(new ValidationRule("required", true, "Required field."));

        this.validators["Title"].addRule(
            new ValidationRule("minlength",4,"Requires more than 5 characters."));

        this.validators["Title"].addRule(
            new ValidationRule("maxlength",50,"Requires less than 50 characters."));

        this.validators["Category"].addRule(
            new ValidationRule("required", true, "Required field."));

        this.validators["Category"].addRule(
            new ValidationRule("maxlength",50,"Requires less than 50 characters."));

        this.validators["Location"].addRule(
            new ValidationRule("maxlength",25,"Requires less than 25 characters."));
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

export default JobsDataRow;