import React, { useState, useEffect } from 'react'
import { Container, Row, Nav } from 'react-bootstrap';

/**
 * Renders a horizontal 'caoursel' view if items' names, 
 * @param {*} props, categories, returnActiveCategory
 * 
 * * categories: list of objects with 'name' and 'id' property to be 
 * displayed in caoursel by name, but referenced by id
 * * returnActiveCategory: an optional callback function to pass the 
 * active category back to the parent component when updated, will be 
 * passed the id of the active category when called
 */
const ItemCarousel = props => {

    // State Vars
    const [activeCategory, setActiveCategory] = useState("link-0")

    // onClick functions
    const handleSelect = (selectedKey) => {
        setActiveCategory(selectedKey);
    }

    // Component update and mount functions
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

    // Render functions
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

    return (
        <Container className="categoryListNav">
            <Nav variant="tabs" activeKey={activeCategory}>
                {renderCategories()}

            </Nav>
        </Container>




    );
}

ItemCarousel.defaultProps = {
    categories: [],
    returnActiveCategory: null
}
export default ItemCarousel