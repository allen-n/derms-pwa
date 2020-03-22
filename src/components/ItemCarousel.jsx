import React, { useState, useEffect } from 'react'
import { Container, Row, Nav } from 'react-bootstrap';


const ItemCarousel = props => {

    const [activeCategory, setActiveCategory] = useState("link-0")

    const renderCategories = () => {
        if (!props.itemCategories.length) {
            return (
                <Nav.Item>
                    <Nav.Link eventKey="link-0">No Categories...</Nav.Link>
                </Nav.Item>);
        }

        return props.itemCategories.map(category => (
            <Nav.Item key={category}>
                <Nav.Link eventKey={category} onSelect={handleSelect}>{category}</Nav.Link>
            </Nav.Item>
        ));

    }

    const handleSelect = (selectedKey) => {
        setActiveCategory(selectedKey);
    }

    // Note: the below does not work with defaultActiveKey
    // active key cannot be updated after render
    useEffect(() => {
        if (props.itemCategories.length > 0) {
            setActiveCategory(props.itemCategories[0])
        }
    }, []);

    return (
        <Container className="categoryListNav">
            <Nav variant="tabs" activeKey={activeCategory}>
                {renderCategories()}

            </Nav>
        </Container>




    );
}

ItemCarousel.defaultProps = {
    itemCategories: ['Test1', 'Test2', 'Test3', 'Test4', 'Test5', 'Test6', ]
}
export default ItemCarousel