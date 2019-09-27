/**
 * @var selectedItem
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../Elements/LinkButton';
import Form from '../../../Elements/Form';
import FormGroup from '../../../Elements/FormGroup';
import styles  from './styles.scss';
import ModalConfirm from "../../../Elements/ModalConfirm";
import FormSection from "../../../Elements/FormSection";

class Edit extends Component {
    dataProvider = window.dataProvider.JobCategories;

    constructor(props) {
        super(props);

        this.providerHandler = this.providerHandler.bind(this);
        this.save = this.save.bind(this);
        this.savedDialog = this.savedDialog.bind(this);

        this.state = {
            item: null,
            loading: true,
            debounce: (new Date()).getTime()
        }
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);

        if(this.dataProvider.rows.length == 0){
            this.dataProvider.getAll()
        } else {
            const id = this.props.match.params.id;
            const item = this.dataProvider.getRow(id);

            this.setState({item:item, loading:false});
        }
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "JOB_CATEGORIES_LOADED"){
            const id = this.props.match.params.id;
            this.state.item = this.dataProvider.getRow(id);
            this.state.loading = false;
        } else if (event == "JOB_CATEGORY_SAVED"){
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    savedDialog(){
        return (
            <ModalConfirm
                title={"Category Saved"}
                message={"The Category was successfully saved,"}
                confirm={() => this.props.history.push('/administration/jobcategories')}
                open={this.state.showSavedDialog}
            />
        )
    }

    save(){
        if((new Date()).getTime() > this.state.debounce) {
            const {item} = this.state;

            if(!item.validate()) return;

            if(!item.isDirty())
                this.providerHandler("JOB_CATEGORY_SAVED", null);
            else
                this.dataProvider.saveChanges();
        }

        this.setState({debounce: (new Date()).getTime() + 3000});
    }

    render(){
        const SavedDialog = this.savedDialog;
        const { item } = this.state;
        return (
            <Fragment>
                <SavedDialog />
                {!this.state.loading &&
                    <Form save={this.validate}>
                        <FormGroup
                            id="Name"
                            label="Category"
                            value={item.fields["Name"].getValue()}
                            onChange={(e) => item.fields['Name'].setValue(e.target.value)}
                            validationMessage = {item.fields['Name'].getValidationMessage()}
                        />
                        <div className={styles.buttonGroup}>
                            <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.push('/administration/jobcategories')}  caption="Close"/>
                            <LinkButton type={'primary'} href="#" onClick={this.save} caption="Save"/>
                        </div>
                    </Form>
                }

                {this.state.loading &&
                    <h2>Loading....</h2>
                }
            </Fragment>
        )
    }
}

export default Edit;