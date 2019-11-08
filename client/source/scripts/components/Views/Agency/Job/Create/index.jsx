/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import Form from '../../../../Elements/Form';
import FormGroup from '../../../../Elements/FormGroup';
import styles  from './styles.scss';
import FormSection from "../../../../Elements/FormSection";
import FormGroupButton from "../../../../Elements/FormGroupButton";
import Modal from "../../../../Elements/Modal"
import ModalConfirm from "../../../../Elements/ModalConfirm";
import VerticalNavMenu from "../../../../Elements/VerticalNavMenu";
import JobsDataRow from "../../../../../Data/Models/JobsDataRow";

class Edit extends Component {
    dataProvider = window.dataProvider.jobs;
    categoriesProvider = window.dataProvider.JobCategories;
    agenciesProvider = window.dataProvider.agencies;
    jobDescription = null;

    constructor(props) {
        super(props);

        this.bind();

        let item = new JobsDataRow({
            Id:0,
            AgencyId:0,
            CategoryId:0,
            Title:"",
            Category:"",
            Location:"",
            Status:0,
            Created:0,
        });

        item.subscriberToChanges(this.providerHandler);

        this.state = {
            showDialog: false,
            showAgencyDialog: false,
            showSavedDialog: false,
            item: item,
            categories: [],
            agencies:[],
            selectedAgencyId:0,
            selectedAgency:"",
            selectedAgencyValidation:"",
            debounce: (new Date()).getTime(),
        }

    }

    bind() {
        this.providerHandler = this.providerHandler.bind(this);
        this.itemChangeHandler = this.itemChangeHandler.bind(this);
        this.categoriesProviderHandler = this.categoriesProviderHandler.bind(this);
        this.agencyProviderHandler = this.agencyProviderHandler.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);

        this.openCategoryDialog = this.openCategoryDialog.bind(this);
        this.openAgencyDialog = this.openAgencyDialog.bind(this);

        this.closeCategoryDialog = this.closeCategoryDialog.bind(this);
        this.closeAgencyDialog = this.closeAgencyDialog.bind(this);

        this.categoryDialog = this.categoryDialog.bind(this);
        this.savedDialog = this.savedDialog.bind(this);
        this.agencyDialog = this.agencyDialog.bind(this);

        this.selectCategory = this.selectCategory.bind(this);
        this.selectAgency = this.selectAgency.bind(this);

        this.save = this.save.bind(this);
    }

    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.categoriesProvider.subscribeToChanges(this.categoriesProviderHandler);
        this.agenciesProvider.subscribeToChanges(this.agencyProviderHandler)

        this.agenciesProvider.getAll();
        this.categoriesProvider.getAll();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
        this.categoriesProvider.unsubscribe(this.categoriesProviderHandler);
        this.agenciesProvider.unsubscribe(this.agencyProviderHandler);
    }

    openAgencyDialog(){
        this.setState({showAgencyDialog:true});
    }

    closeAgencyDialog(){
        this.setState({showAgencyDialog:false});
    }

    openCategoryDialog(){
        this.setState({showDialog:true});
    }

    closeCategoryDialog(){
        this.setState({showDialog:false});
    }

    selectCategory(id){
        let category = this.state.categories.find((item) => item.Id == id);

        this.state.item.fields["CategoryId"].setValue(category.Id);
        this.state.item.fields["Category"].setValue(category.Name);

        this.setState(this.state);
    }

    selectAgency(id){
        let agency = this.state.agencies.find((item) => item.Id == id);

        this.state.selectedAgencyId = agency.Id;
        this.state.selectedAgency = agency.Name;
        this.state.showAgencyDialog = false;

        this.setState(this.state);
    }

    providerHandler(message, data){
        if (message == "JOB_CREATED"){
            this.state.item.fields["Id"].setValue(data);
            this.state.showSavedDialog = true;
        }

        this.setState(this.state);
    }

    categoriesProviderHandler(message, data){
        switch (message) {
            case "JOB_CATEGORIES_LOADED":
                this.state.categories = [];
                this.categoriesProvider.rows.map((category) =>{
                    this.state.categories.push(
                        {Id: category.fields["Id"].getValue(), Name: category.fields["Name"].getValue()}
                    )
                });

                this.setState({categories: this.state.categories});
                break;
        }
    }

    agencyProviderHandler(event, data){
        if(event == "AGENCIES_LOADED") {
            let agencies = [];

            this.agenciesProvider.getRows().map((agency) => {
                agencies.push({
                    Id:agency.fields["Id"].getValue(),
                    Name:agency.fields["Name"].getValue()
                });

                this.setState({agencies: agencies});
            })
        }
    }

    itemChangeHandler(row, field){
        this.setState(this.state);
    }

    onFieldChange(fieldName, value){
        let field = this.state[fieldName];
        field.setValue(value);

        this.setState(this.state);
    }

    save(){
        const {item, selectedAgencyId, debounce} = this.state;
        const now = (new Date()).getTime();
        if( now > debounce) {
            const agencyIsValid = selectedAgencyId > 0;
            const itemIsValid = item.validate();

            if (agencyIsValid && itemIsValid) {
                item.fields["AgencyId"].setValue(selectedAgencyId);
                item.fields["Created"].setValue(now/1000);
                this.dataProvider.create(item);
            }

            this.setState({
                selectedAgencyValidation: agencyIsValid ? "" : "Required",
                item: item,
                debounce: now + 3000
            });
        }
    }

    categoryDialog(){
        return (
            <Modal open={this.state.showDialog}
                   close={this.closeCategoryDialog}>
                <h2>Choose A Category</h2>
                <VerticalNavMenu
                    idField="Id"
                    captionField="Name"
                    defaultAction={(id) => this.selectCategory(id)}
                    data={this.state.categories}
                />
            </Modal>
        )
    }

    agencyDialog(){
        return (
            <Modal open={this.state.showAgencyDialog}
                   close={this.closeCategoryDialog}>
                <h2>Choose A Agency</h2>
                <VerticalNavMenu
                    idField="Id"
                    captionField="Name"
                    defaultAction={(id) => this.selectAgency(id)}
                    data={this.state.agencies}
                />
            </Modal>
        )
    }

    savedDialog(){
        let id = this.state.item.getKey();

        return (
            <ModalConfirm
                title={"Job Saved"}
                message={"The job was successfully saved,"}
                confirm={() => this.props.history.replace(`/administration/job/edit/${id}`)}
                open={this.state.showSavedDialog}
            />
        )
    }

    render(){
        const { item } = this.state;

        const CategoryDialog = this.categoryDialog;
        const SavedDialog = this.savedDialog;
        const AgencyDialog = this.agencyDialog;

        return(
            <Fragment>
                <CategoryDialog />
                <SavedDialog />
                <AgencyDialog />
                {item != null &&
                <Form save={this.save}>
                    <FormSection justify={"start"}>
                        <h3>Job Details</h3>
                        <FormGroup
                            id="Title"
                            label="Title"
                            value={item.fields['Title'].getValue()}
                            validationMessage = {item.fields['Title'].getValidationMessage()}
                            onChange={(e) => item.fields['Title'].setValue(e.target.value)}
                        />
                        <FormGroupButton
                            id="Agency"
                            label={"Agency"}
                            value={this.state.selectedAgency}
                            validationMessage = {this.state.selectedAgencyValidation}
                            onChange={(e) => {}}
                            onClick={() => this.openAgencyDialog()}
                        />
                        <FormGroupButton
                            id="Category"
                            label="Category"
                            value={item.fields['Category'].getValue() || ''}
                            validationMessage = {item.fields['Category'].getValidationMessage()}
                            onChange={(e) => item.fields['Category'].setValue(e.target.value)}
                            onClick={() => this.openCategoryDialog()}
                        />
                        <FormGroup
                            id="Location"
                            label="Location"
                            value={item.fields['Location'].getValue() || ''}
                            validationMessage = {item.fields['Location'].getValidationMessage()}
                            onChange={(e) => item.fields['Location'].setValue(e.target.value)}
                        />
                    </FormSection>
                    <FormSection justify={"end"}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()}  caption="Close"/>
                        <LinkButton type={'primary'} href="#" onClick={this.save} caption="Save"/>
                    </FormSection>
                </Form>
                }
                {item == null &&
                    <h2>Loading...</h2>
                }
            </Fragment>
        );
    }
}

export default Edit