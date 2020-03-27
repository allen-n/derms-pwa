import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import ItemCarousel from './ItemCarousel'
import ItemList from './ItemList'
import { withFirebase } from '../firebase/withFirebase'
import { Button } from 'react-bootstrap'


const ReportItemType = props => {
    const [itemNames, setItemNames] = useState([])
    const [categoryNames, setCategoryNames] = useState([])
    const [categoryItemMap, setCategoryItemMap] = useState({})
    const [activeCategory, setActiveCategory] = useState(null)
    const [activeItem, setActiveItem] = useState(null)
    const [submitDisabled, setSubmitDisabled] = useState(true) // disable submit til something is picked

    const { itemCategoryCollection, reportData, userData } = props.firebase

    const history = useHistory();

    const routeClick = () => {
        history.push("/report-info");
    }

    const returnActiveCategory = (newActiveCategory) => {
        // set active category with key passed from selected node 
        // in child item carousel, which is the category key
        setActiveCategory(newActiveCategory)

    }

    const returnActiveItem = (newActiveItem) => {
        // set active category with key passed from selected node 
        // in child item carousel, which is the category key
        setActiveItem(newActiveItem)
    }

    // Make sure report data up to now is collected, if not route back
    useEffect(() => {
        if (reportData.latLng == null) {
            history.push('/locate')
        }
    }, [])

    useEffect(() => {
        setItemNames(categoryItemMap[activeCategory])
    }, [categoryItemMap, activeCategory])

    useEffect(() => {
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
        
        reportData.categoryId = itemInfo.category.id
        reportData.categoryName = itemInfo.category.name
        if (itemInfo.item.id != "link-1" && itemInfo.item.id != null) {
            // If an item is picked, we can submit, 
            // link-1 was default set in ItemList.jsx, to it starts as null
            reportData.itemId = itemInfo.item.id
            reportData.itemName = itemInfo.item.name
            setSubmitDisabled(false)
        }

    }, [activeCategory, activeItem])

    useEffect(() => {
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

export default withFirebase(ReportItemType)