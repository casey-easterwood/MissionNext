export class ValidationRule {
    name = '';
    rule = '';
    message = '';

    constructor(name, rule, message){
        this.name = name;
        this.rule = rule;
        this.message = message;
    }
}

export class FieldValidator{
    rules = [];

    constructor(){

        this.addRule = this.addRule.bind(this);
        this.validate = this.validate.bind(this);
    }

    addRule(validationRule){
        this.rules.push(validationRule);
    }

    validate(field){
        field.setValidationMessage('');
        field.setValid();

        for(let rule of this.rules){
            switch (rule.name.toLocaleLowerCase()) {
                case 'required':
                    if(field.getValue().length == 0) {
                        field.setInvalid(rule.message);
                    }
                    break;
                case 'minlength':
                    if(field.getValue().length < rule.rule){
                        field.setInvalid(rule.message);
                    }
                    break;
                case 'maxlength':

                    if(field.getValue().length > rule.rule){
                        field.setInvalid(rule.message);
                    }
                    break;
            }
        }

        return field.isValid();
    };
}
