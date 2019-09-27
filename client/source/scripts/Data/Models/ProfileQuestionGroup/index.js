import DataRow from "../DataRow";
import DataField from "../DataField";
import {FieldValidator, ValidationRule} from "../FieldValidator";

class ProfileQuestionGroup extends DataRow{
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
        this.addField(new DataField("Name", "number", data["Name"], false));
    }

    addValidation(){
        this.validators["Id"] = new FieldValidator();
        this.validators["Name"] = new FieldValidator();

        this.validators["Id"].addRule(new ValidationRule("required", true, "Required field."));

        this.validators["Name"].addRule(
            new ValidationRule("minlength",4,"Requires more than 5 characters."));

        this.validators["Name"].addRule(
            new ValidationRule("maxlength",50,"Requires less than 25 characters."));

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

export default ProfileQuestionGroup;