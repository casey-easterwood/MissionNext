class Repository {
    rows = [];
    subscribers = [];

    constructor(){
        this.addRow     = this.addRow.bind(this);
        this.getRow     = this.getRow.bind(this);
        this.getRows    = this.getRows.bind(this);
        this.rowChangeHandler   = this.rowChangeHandler.bind(this);
        this.publishChanges     = this.publishChanges.bind(this);
        this.subscribeToChanges = this.subscribeToChanges.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
    }

    subscribeToChanges(subscriber){
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriber){
        for (let i=0;i<this.subscribers.length;i++){
            if(this.subscribers[i] === subscriber){
                this.subscribers.splice(i, 1);
            }
        }
    }

    publishChanges(message, data){
        if(this.subscribers){
            for(let sub of this.subscribers)
                sub(message, data);
        }
    }

    rowChangeHandler(row, field){
        this.publishChanges("ROW_CHANGED", {row:row, field:field});
    }

    addRow(dataRow){
        dataRow.subscriberToChanges(this.rowChangeHandler);

        this.rows.push(dataRow);

        this.publishChanges("ROW_ADDED", dataRow);
    }

    getRow(key){
        for(let r of this.rows){
            if(r.getKey() == key){
                return r;
            }
        }

        return null;
    }

    getRows(){
        return this.rows;
    }
}

export default Repository;