import React, { useState, useEffect } from 'react'
import { Container, Row, ListGroup, ListGroupItem } from 'react-bootstrap';


const ItemList = props => {

    const [activeItem, setActiveItem] = useState("link-0")

    const renderItems = () => {
        if (!props.items.length) {
            return (
                <ListGroup.Item eventKey="link-0">No Items...</ListGroup.Item>);
        }

        return props.items.map(item => (
            <ListGroup.Item action key={item} eventKey={item} onSelect={handleSelect}>{item}</ListGroup.Item>
        ));

    }

    const handleSelect = (selectedKey) => {
        setActiveItem(selectedKey);
    }

    // Note: the below does not work with defaultActiveKey
    // active key cannot be updated after render
    // useEffect(() => {
    //     if (props.items.length > 0) {
    //         setActiveItem(props.items[0])
    //     }
    // }, []);

    return (
        <Container className="itemListContainer">
            <ListGroup variant="flush" activeKey={activeItem}>
                {renderItems()}
            </ListGroup>
        </Container>


    );
}

ItemList.defaultProps = {
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9']
}
export default ItemList