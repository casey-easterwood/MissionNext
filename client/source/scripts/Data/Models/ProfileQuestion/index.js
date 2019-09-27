import DataRow from "../DataRow";
import DataField from "../DataField";
import {FieldValidator, ValidationRule} from "../FieldValidator";

class ProfileQuestion extends DataRow{
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
        this.addField(new DataField("GroupId", "number", data["GroupId"], false));
        this.addField(new DataField("Question", "string", data["Question"], false));
    }

    addValidation(){
        this.validators["Id"] = new FieldValidator();
        this.validators["GroupId"] = new FieldValidator();
        this.validators["Question"] = new FieldValidator();

        this.validators["Id"].addRule(new ValidationRule("required", true, "Required field."));

        this.validators["GroupId"].addRule(new ValidationRule("required", true, "Required field."));

        this.validators["Question"].addRule(
            new ValidationRule("minlength",4,"Requires more than 5 characters."));

        this.validators["Question"].addRule(
            new ValidationRule("maxlength",100,"Requires less than 25 characters."));

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

export default ProfileQuestion;