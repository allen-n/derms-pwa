import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import ItemList from './ItemList'

const ReportListModal = (props) => {

    const [activeItem, setActiveItem] = useState(null);

    const returnActiveItem = (newActiveItem) => {
        // set active category with key passed from selected node 
        // in child item carousel, which is the category key
        setActiveItem(newActiveItem)
    }

    const handleClose = props.handleClose // () => setShow(false);
    // const handleShow = props.handleShow   // () => setShow(true);

    return (
        <>
            {/* <Button variant="primary" onClick={handleShow}>
                Launch demo modal
        </Button> */}

            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Recent Reports</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Here are some recent reports from your area:
                    <ItemList
                        items={props.items}
                        returnActiveItem={returnActiveItem}
                        disableActiveItem={true}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button variant="primary" onClick={handleClose}>
                        Take me there
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </>
    );
}

ReportListModal.defaultProps = {
    items: [] // list of items to list, should be HTML or JSX elements
}

export default ReportListModal