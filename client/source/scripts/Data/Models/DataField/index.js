
class DataField {
    name = '';
    type = 'string';
    originalValue = '';
    value = '';
    readOnly = false;
    isKey = false;
    validationMessage = '';
    fieldChangeHandler = null;
    valid = true;
    isTransient = false;

    constructor(name, type, value, isKey, isTransient){
        this.isDirty    = this.isDirty.bind(this);
        this.isValid    = this.isValid.bind(this);
        this.setName    = this.setName.bind(this);
        this.setValue   = this.setValue.bind(this);
        this.setType    = this.setType.bind(this);
        this.setValid   = this.setValid.bind(this);
        this.setInvalid = this.setInvalid.bind(this);
        this.getName    = this.getName.bind(this);
        this.getValue   = this.getValue.bind(this);
        this.getType    = this.getType.bind(this);
        this.getValidationMessage   = this.getValidationMessage.bind(this);
        this.setValidationMessage   = this.setValidationMessage.bind(this);
        this.subscribeToChanges     = this.subscribeToChanges.bind(this);
        this.publishChanges         = this.publishChanges.bind(this);

        this.isKey = isKey || false;
        this.name = name;
        this.type = type;
        this.originalValue = this.value = value;
        this.isTransient = (isTransient);
    }

    subscribeToChanges(subscriber){
        this.fieldChangeHandler = subscriber;
    }

    publishChanges(field){
        if(this.fieldChangeHandler)
            this.fieldChangeHandler(this, field);
    }

    isDirty(){
        return this.originalValue != this.value;
    }

    isValid(){
        return this.valid;
    }

    setValid(){
        this.valid = true;
        return this;
    }

    setInvalid(message){
        this.valid = false;
        this.validationMessage = message;
        return this;
    }

    setName(name){
        this.name = name;
        return this;
    }

    setValue(value){
        this.value = value;
        this.publishChanges(this);
        return this;
    }

    setType(type){
        this.type = type;
        return this;
    }

    setValidationMessage(message){
        this.validationMessage = message;
        return this;
    }

    getName(){
        return this.name;
    }

    getValue(){
        return this.value;
    }

    getType(){
        return this.type;
    }

    getValidationMessage(){
        return this.validationMessage;
    }
}

export default DataField;