class DataRow {
    fields = [];
    new = false;
    saving = false;
    keyField = null;
    rowChangeHandler = null;

    constructor(){
        this.getChanges     = this.getChanges.bind(this);
        this.getKey         = this.getKey.bind(this);
        this.addField       = this.addField.bind(this);
        this.setNew         = this.setNew.bind(this);
        this.setSaving      = this.setSaving.bind(this);
        this.isDirty        = this.isDirty.bind(this);
        this.isValid        = this.isValid.bind(this);
        this.isNew          = this.isNew.bind(this);
        this.isSaving       = this.isSaving.bind(this);
        this.markClean      = this.markClean.bind(this);
        this.subscriberToChanges    = this.subscriberToChanges.bind(this);
        this.publishChanges         = this.publishChanges.bind(this);
        this.handleFieldChanges     = this.handleFieldChanges.bind(this);
    }

    subscriberToChanges(subscriber){
        this.rowChangeHandler = subscriber;
    }

    publishChanges(field){
        if(this.rowChangeHandler)
            this.rowChangeHandler(this, field);
    }

    handleFieldChanges(field){
        this.publishChanges(field);
    }

    getFieldValue(fieldName){
        return this.fields[fieldName].getValue() || '';
    }

    setFieldValue(fieldName, value){
        return this.fields[fieldName].setValue(value);
    }

    getChanges(){
        let fieldData = [];

        for(let key of Object.keys(this.fields)){
            let f = this.fields[key];

            if(!f.isTransient) {
                if((f.isDirty()) || f.isKey){
                    fieldData.push({name: f.getName(), value: f.getValue()});
                }
            }
        }

        return fieldData;
    }

    getFieldData(){
        let fieldData = [];

        for(let key of Object.keys(this.fields)){
            let f = this.fields[key];

            if(!f.isTransient) {
                fieldData.push({name: f.getName(), value: f.getValue()});
            }
        }

        return fieldData;
    }

    getKey(){
        if(this.keyField){
            return this.fields[this.keyField].getValue();
        }
        return null;
    }

    addField(field){
        if(field.isKey)
            this.keyField = field.getName();

        field.subscribeToChanges(this.handleFieldChanges);

        this.fields[field.name] = field;
    }

    setNew(value){
        this.isNew = value;
    }

    setSaving(value){
        this.isSaving = value;
    }

    isDirty(){
        for(let k of Object.keys(this.fields)){
            let f = this.fields[k];
            if(f.isDirty()) {
                return true;
            }
        }
        return false;
    }

    isValid(){
        for(let k of Object.keys(this.fields)){
            let f = this.fields[k];
            if(!f.isValid())
                return false;
        }
        return true;
    }

    markClean(){
        for(let k of Object.keys(this.fields)){
            let f = this.fields[k];
            f.originalValue = f.value;
        }
        return true;
    }

    isNew(){
        return this.new;
    }

    isSaving(){
        return this.saving;
    }

}

export default DataRow;