import React, { useState, useEffect, useRef } from 'react'
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
const ItemCarousel = (props, ref) => {

    // State Vars
    const nullString = "link-0"
    const [activeCategory, setActiveCategory] = useState(nullString)
    const [activeCategoryIdx, setActiveCategoryIdx] = useState(0)
    const [categoryIdToIdx, setCategoryIdToIdx] = useState({ nullString: -1 })

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
            var map = { nullString: -1 }
            var idx = 0
            for (let i in props.categories) {
                map[props.categories[i].id] = idx
                idx += 1
            }
            setCategoryIdToIdx(map)
        }
    }, [props.categories]);

    useEffect(() => {
        if (props.returnActiveCategory != null) {
            props.returnActiveCategory(activeCategory);
            const idx = categoryIdToIdx[activeCategory]
            setActiveCategoryIdx(idx)
        }
    }, [activeCategory]);

    useEffect(() => {
        if (props.handleSwipeVal) {
            var newIdx = null
            if (props.handleSwipeVal > 0) {
                newIdx = Math.min(props.categories.length - 2, activeCategoryIdx + 1)
            }
            if (props.handleSwipeVal < 0) {
                newIdx = Math.max(0, activeCategoryIdx - 1)
            }
            if (newIdx != null) {
                const newCategory = props.categories[newIdx].id
                handleScroll(props.handleSwipeVal)
                setActiveCategoryIdx(newIdx)
                setActiveCategory(newCategory)
            }
        }
    }, [props.handleSwipeVal])

    const carouselRef = useRef(null)

    // Handle auto scrolling the carousel when swipes trigger nav
    const handleScroll = (sign) => {
        sign = Math.sign(sign)
        let vw = window.outerWidth;
        vw = vw / props.categories.length
        carouselRef.current.scrollLeft += sign * vw
    }

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
            <Nav variant="tabs" activeKey={activeCategory} ref={carouselRef}>
                {renderCategories()}

            </Nav>
        </Container>




    );
}

ItemCarousel.defaultProps = {
    categories: [],
    returnActiveCategory: null,
    handleSwipeVal: null // Set the active category from parent
}
export default ItemCarousel