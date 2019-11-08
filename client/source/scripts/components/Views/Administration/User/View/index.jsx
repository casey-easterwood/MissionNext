/**
 * @var user
 */

import React, {Component, Fragment} from 'react';
import LinkButton from '../../../../Elements/LinkButton';
import styles  from './styles.scss';

class View extends Component {
    dataProvider = window.dataProvider.users;

    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.providerHandler = this.providerHandler.bind(this);
        this.state = {
            loading:true,
            item: null,
            debounce: (new Date()).getTime()
        }
    }
    componentDidMount(){
        this.dataProvider.subscribeToChanges(this.providerHandler);
        this.dataProvider.getAllUsers();
    }

    componentWillUnmount(){
        this.dataProvider.unsubscribe(this.providerHandler);
    }

    providerHandler(event, data){
        if(event == "USERS_LOADED"){
            const id = this.props.match.params.id;
            this.state.item = this.dataProvider.getRow(id);
            this.state.loading = false;
        }

        this.setState(this.state);
    }

    getTitle(){
        const { item } = this.state;

        let name
            = item.getFieldValue('FirstName')
            + " "
            + item.getFieldValue('LastName');

        if(name === "")
            name = item.getFieldValue('UserLogin');

        return 'Edit ' + name;
    }

    render(){
        const { item, loading } = this.state;

        const id = (item == null) ? 0 : item.fields["UserId"].getValue();
        const iconSrc = "/resources/images/icons/baseline-person-24px.svg";

        return(
            <Fragment>
                {!loading &&
                    <div className={styles.container}>
                    <div className={styles.imageContainer}>
                        <img className={styles.icon}
                             id={id}
                             src={iconSrc}
                             alt="User Icon"
                        />
                    </div>
                    <div className={styles.nameContainer}>
                        <p className={styles.userName}>
                            {item.fields['FirstName'].getValue()}
                            &nbsp;
                            {item.fields['LastName'].getValue()}
                        </p>
                        <p>
                            <a href="mailto:user.fields['Email'].getValue()">
                                {item.fields['Email'].getValue()}
                            </a>
                        </p>
                        <p>
                            {item.fields['UserLogin'].getValue()}
                        </p>
                        <p>
                            {item.fields['RoleName'].getValue()}
                        </p>
                    </div>
                    <div className={styles.buttonGroup}>
                        <LinkButton type={'secondary'} href="#" onClick={() => this.props.history.goBack()}  caption="Close"/>
                    </div>
                </div>
                }

                {loading &&
                    <h2>Loading....</h2>
                }
            </Fragment>

        )
    }
}

export default View