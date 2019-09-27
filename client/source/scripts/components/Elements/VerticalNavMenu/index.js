/**
 * @var auth
 */

import React, {Component} from 'react';
import styles from './styles.scss';

export class VerticalMenuItem extends Component {
    constructor(props) {
        super(props);
    };

    render(){
        const {id, caption, onClick, active} = this.props;
        const onClickItem = (e) => { onClick(e.target.id)};
        const className = (active) ? styles.active : "";

        return(
            <li className={className} key={id} id={id} onClick={onClickItem}>
                <span id={id}>{caption}</span>
            </li>
        );
    }
}

class VerticalNavMenu extends Component {
    SCENE_LIST = 'list';
    constructor(props) {
        super(props);

        this.state = {
            scene: this.SCENE_LIST,
            id: 0
        };

        this.clickMenu = this.clickMenu.bind(this);
        this.renderList = this.renderList.bind(this);
    };

    clickMenu(event, id){
        this.setState({scene:this.SCENE_MENU, id:id});

        event.cancelBubble=true;
        event.stopPropagation();
    };

    renderList(){
        const {icon, idField, captionField, defaultAction, data, menuActions, selectedId} = this.props;

        return(
            <ul className={styles.List}>
                {data.map(d =>
                    <VerticalMenuItem
                        icon={icon}
                        key={d[idField]}
                        id={d[idField]}
                        active={selectedId == d[idField]}
                        caption={d[captionField]}
                        onClick={defaultAction}
                        menuActions={menuActions}
                        onClickMenu={(event)=>this.clickMenu(d[idField])}
                    />
                )}
            </ul>
        );
    };

    render(){
        return this.renderList();
    };
}


export default VerticalNavMenu;