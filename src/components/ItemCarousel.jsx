import React, { useState, useEffect } from 'react'
import { Container, Row, Nav } from 'react-bootstrap';


const ItemCarousel = props => {

    const [activeCategory, setActiveCategory] = useState("link-0")

    const renderCategories = () => {
        if (!props.categories.length) {
            return (
                <Nav.Item>
                    <Nav.Link eventKey="link-0">No Categories...</Nav.Link>
                </Nav.Item>);
        }

        return props.categories.map(category => (
            <Nav.Item key={category.id}>
                <Nav.Link eventKey={category.id} onSelect={handleSelect}>{category.name}</Nav.Link>
            </Nav.Item>
        ));

    }

    const handleSelect = (selectedKey) => {
        setActiveCategory(selectedKey);
        // if (props.returnActiveCategory != null) {
        //     props.returnActiveCategory(selectedKey);
        // }
    }

    // Note: the below does not work with defaultActiveKey
    // active key cannot be updated after render
    useEffect(() => {
        if (props.categories.length > 0) {
            setActiveCategory(props.categories[0].id)
        }
    }, [props.categories]);

    useEffect(() => {
        if (props.returnActiveCategory != null) {
            props.returnActiveCategory(activeCategory);
        }
    }, [activeCategory]);

    return (
        <Container className="categoryListNav">
            <Nav variant="tabs" activeKey={activeCategory}>
                {renderCategories()}

            </Nav>
        </Container>




    );
}

ItemCarousel.defaultProps = {
    categories: ['Test1', 'Test2', 'Test3', 'Test4', 'Test5', 'Test6',],
    returnActiveCategory: null
}
export default ItemCarousel