import React, { useState, useEffect } from 'react'
import { Container, ListGroup } from 'react-bootstrap';

/**
 * 
 * @param {*} props, items, returnActiveItem, disableActiveItem 
 * 
 * * items: list of objects of form [{ name: 'Item 1', id: '1ao1' }] which will
 *  be displayed as a vertically scrolling list, showing the 'name' property
 * * returnActiveItem: an optional callback function to pass the 
 * active category back to the parent component when updated, will be 
 * passed the id of the active category when called
 * * disableActiveItem: boolean, if true the active item selection highligting is disabled
 */
const ItemList = (props) => {

    // State vars
    const [activeItem, setActiveItem] = useState("link-1")
    const [itemListGroup, setItemListGroup] = useState(null)

    // onClick handlers
    const handleSelect = (selectedKey) => {
        if (!props.disableActiveItem) {
            setActiveItem(selectedKey);
        }

    }

    // Component state update functions
    useEffect(() => {
        setItemListGroup(renderItems())
    }, [props.items])

    useEffect(() => {
        if (props.returnActiveItem != null) {
            props.returnActiveItem(activeItem);
        }
    }, [activeItem]);

    // Render functions
    const renderItems = () => {
        if (!props.items.length) {
            return (
                <ListGroup.Item key="link-1" eventKey="link-1">No Items...</ListGroup.Item>);
        }

        return props.items.map((item, idx) => (
            <ListGroup.Item key={idx} eventKey={item.id} onSelect={handleSelect}>{item.name}</ListGroup.Item>
        ));

    }

    return (
        <Container className="itemListContainer">
            <ListGroup variant="flush" activeKey={activeItem} key={"ti12312312tle"}>
                {itemListGroup}
            </ListGroup>
        </Container>


    );
}

ItemList.defaultProps = {
    items: [],
    // items: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' },
    // { name: 'Item 4' }, { name: 'Item 5' }, { name: 'Item 6' }, { name: 'Item 7' }], // for testing
    returnActiveItem: null,
    disableActiveItem: false // disables the active item highlighting
}
export default ItemList