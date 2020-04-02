import React, { useState, useEffect } from 'react'
import { Container, ListGroup } from 'react-bootstrap';


const ItemList = (props) => {

    const [activeItem, setActiveItem] = useState("link-1")


    const renderItems = () => {
        if (!props.items.length) {
            return (
                <ListGroup.Item key="link-1" eventKey="link-1">No Items...</ListGroup.Item>);
        }

        return props.items.map((item, idx) => (
            <ListGroup.Item key={idx} eventKey={item.id} onSelect={handleSelect}>{item.name}</ListGroup.Item>
        ));

    }

    const [itemListGroup, setItemListGroup] = useState(null)
    useEffect(() => {
        setItemListGroup(renderItems())
    }, [props.items])

    const handleSelect = (selectedKey) => {
        if (!props.disableActiveItem) {
            setActiveItem(selectedKey);
        }

    }

    useEffect(() => {
        if (props.returnActiveItem != null) {
            props.returnActiveItem(activeItem);
        }
    }, [activeItem]);

    // Note: the below does not work with defaultActiveKey
    // active key cannot be updated after render
    // useEffect(() => {
    //     if (props.items.length > 0) {
    //         setActiveItem(props.items[0])
    //     }
    // }, []);

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