/**
 * @var auth
 */

import React, {Component, Fragment} from 'react';
import styles from './styles.scss';
import Modal from "../Modal";

class MenuButton extends Component {
    render(){
        let {onClick, caption, id, warning} = this.props;

        return(
            <div className={(warning) ? styles.MenuButtonWarning: styles.MenuButton} onClick={()=>onClick(id)}>
                <span>
                    {caption}
                </span>
            </div>
        )
    }
}

export class VerticalMenuItem extends Component {
    constructor(props) {
        super(props);
    };

    render(){
        const {id, caption, onClick, icon, onClickMenu, menuActions} = this.props;
        const onClickItem = (e) => { onClick(e.target.id)};
        const iconSrc = "/resources/images/icons/" + icon;
        const menuIconSrc = "/resources/images/icons/" + "baseline-menu-24px.svg";

        return(
            <li key={id} id={id} onClick={onClickItem}>
                {icon &&
                    <div className={styles.icon}>
                        <img id={id}
                             src={iconSrc}
                             alt="User Icon"
                        />
                    </div>
                }
                <span id={id}>{caption}</span>
                {menuActions &&
                <img className={styles.menuIcon}
                     id={id} src={menuIconSrc}
                     alt="User Icon"
                     onClick={onClickMenu}
                />
                }
            </li>
        );
    }
}

class VerticalMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMenu: false,
            id: 0
        };

        this.clickMenu = this.clickMenu.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
    };

    clickMenu(event, id){
        this.setState({showMenu:true, id:id});

        event.cancelBubble=true;
        event.stopPropagation();
    };

    renderMenu(){
        const {menuActions} = this.props;

        return (
                <Modal open={this.state.showMenu} close={() => this.setState({showMenu:false})}>
                    {menuActions &&
                    <div className={styles.Menu}>
                        {menuActions.map((action, index) =>
                            <MenuButton
                                key={index}
                                id={this.state.id}
                                caption={action.caption}
                                onClick={action.onClick}
                                warning={action.warning}
                            />
                        )}
                        <MenuButton
                            key={0}
                            id={0}
                            caption={"Close"}
                            onClick={() => this.setState({scene: this.SCENE_LIST})}
                            warning={false}
                        />
                    </div>
                    }
                </Modal>
        )
    };

    render(){
        const {icon, idField, captionField, defaultAction, data, menuActions} = this.props;

        const Menu = this.renderMenu;

        return (
            <Fragment>
                <Menu/>
                <ul className={styles.List}>
                    {data.map(d =>
                        <VerticalMenuItem
                            icon={icon}
                            key={d.fields[idField].getValue()}
                            id={d.fields[idField].getValue()}
                            caption={d.fields[captionField].getValue()}
                            onClick={defaultAction}
                            menuActions={menuActions}
                            onClickMenu={(event)=>this.clickMenu(event, d.fields[idField].getValue())}
                        />
                    )}

                </ul>
            </Fragment>
        )
    };
}

export default VerticalMenu;