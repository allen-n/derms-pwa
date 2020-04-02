import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import ItemCarousel from './ItemCarousel'
import ItemList from './ItemList'
import { withFirebase } from '../../firebase/withFirebase'
import { Button } from 'react-bootstrap'

/**
 * 
 * @param {*} props see below
 * * routeClickDest: default null, react router string for route to navigate to after submission
 * * reportData: default null, not null if on the report flow, contains report data
 * * searchData: default null, not null if on the search flow, contains search data
 * * routeBackwardDest: default  null, react router string to route back to if data is missing 
 */
const ItemTypeSelect = props => {

    // State Vars
    const [itemNames, setItemNames] = useState([])
    const [categoryNames, setCategoryNames] = useState([])
    const [categoryItemMap, setCategoryItemMap] = useState({})
    const [activeCategory, setActiveCategory] = useState(null)
    const [activeItem, setActiveItem] = useState(null)
    const [submitDisabled, setSubmitDisabled] = useState(true) // disable submit til something is picked

    // Database vars
    const { itemCategoryCollection, userData } = props.firebase

    const history = useHistory();

    const routeClickDest = props.routeClickDest;
    const routeBackwardDest = props.routeBackwardDest;

    // Routing functions
    const checkLocationSet = (reportData) => {
        if (reportData.coordinates == null) {
            alert("Location must be selected.")
            history.push(routeBackwardDest)
        }
    }

    const checkLoggedIn = () => {
        if(userData == null) {
            // alert("You must be logged in.")
            history.push(routeBackwardDest)
        }
    }
    const routeClick = () => {
        history.push(routeClickDest);
    }

    // Callbacks for child components

    /**
     * Sets active category with key passed from selected node 
     * in child item carousel, which is the category key
     * @param {*} newActiveCategory a callback function to allow children to update
     * state by passing a category id to this function 
     */
    const returnActiveCategory = (newActiveCategory) => {
        setActiveCategory(newActiveCategory)

    }

    /**
     * Sets active item with key passed from selected node 
     * in child item list, which is the item key
     * @param {*} newActiveItem a callback function to allow children to update
     * state by passing a category id to this function 
     */
    const returnActiveItem = (newActiveItem) => {
        setActiveItem(newActiveItem)
    }

    // Component state effects
    useEffect(() => {
        setItemNames(categoryItemMap[activeCategory])
    }, [categoryItemMap, activeCategory])

    useEffect(() => {
        const dataVar = props.reportData != null ? props.reportData : props.searchData;

        const itemInfo = {
            category: {
                name: null,
                id: activeCategory
            },
            item: {
                name: null,
                id: activeItem
            }
        }

        dataVar.categoryId = itemInfo.category.id
        dataVar.categoryName = itemInfo.category.name
        if (itemInfo.item.id != "link-1" && itemInfo.item.id != null) {
            // If an item is picked, we can submit, 
            // link-1 was default set in ItemList.jsx, to it starts as null
            dataVar.itemId = itemInfo.item.id
            dataVar.itemName = itemInfo.item.name
            setSubmitDisabled(false)
        }

    }, [activeCategory, activeItem])

    useEffect(() => {
        // Make sure report data up to now is collected, if not route back
        if (props.reportData != null) {
            checkLocationSet(props.reportData);
        }

        if (props.searchData != null) {
            checkLoggedIn();
        }

        // Check that either reportData or searchData is set
        if (props.reportData != null && props.searchData != null) {
            console.error("Error: reportData and searchData are both set, but shouldn't be")
        }
        if (props.reportData == null && props.searchData == null) {
            console.error("Error: reportData and searchData are both null, but shouldn't be")
        }

        // Load categories and items
        const getCategories = itemCategoryCollection
            .orderBy('name', 'desc')
            .onSnapshot(({ docs }) => { //fires any time the db changes
                const categoriesFromDB = []
                const itemCategoryDict = {}

                docs.forEach(doc => {
                    const itemsInCategory = []
                    itemCategoryCollection.doc(doc.id)
                        .collection('items').get().then((items) => {
                            items.docs.forEach((item) => {
                                const detailItem = {
                                    id: item.id,
                                    name: item.data().name,
                                }
                                itemsInCategory.push(detailItem)
                            })
                            itemCategoryDict[doc.id] = itemsInCategory
                            // update state inside this .then since return is async
                            setCategoryItemMap(itemCategoryDict)
                        })

                    const details = {
                        id: doc.id,
                        name: doc.data().name,
                    }

                    categoriesFromDB.push(details)
                    setCategoryNames(categoriesFromDB)
                })


            })

        // prevents a memory leak
        return () => {
            getCategories()
        }
    }, [])

    return (
        <div>
            <ItemCarousel categories={categoryNames} returnActiveCategory={returnActiveCategory} />
            <ItemList items={itemNames} returnActiveItem={returnActiveItem}></ItemList>
            <Button onClick={routeClick} disabled={submitDisabled}> Confirm </Button>
        </div>

    );
}

ItemTypeSelect.defaultProps = {
    routeClickDest: null, // "react router string for route after submission"
    reportData: null, // not null if on the report flow, contains report data
    searchData: null, // not null if on the search flow, contains search data
    routeBackwardDest: null // react router string to route back to if data is missing 

}

export default withFirebase(ItemTypeSelect)