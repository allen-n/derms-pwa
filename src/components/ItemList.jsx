import React, { useState, useEffect } from 'react'
import { Container, Row, ListGroup, ListGroupItem } from 'react-bootstrap';


const ItemList = props => {

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
        setActiveItem(selectedKey);
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
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9'],
    returnActiveItem: null
}
export default ItemList