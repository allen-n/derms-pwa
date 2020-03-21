import React from 'react'
import { Button, Modal } from 'react-bootstrap'

const ConfirmModal = ({
  show, props, onConfirm, onDeny }) => {

  return (
    <>
      <Modal
        {...props}
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>

        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onDeny}>
            {props.denytext}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {props.confirmtext}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmModal