import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function ModalUpdatePost({ event, isOpen, onClose, ...props }) {
  console.log(event);
  return (
    <Modal
      style={{ marginTop: "15%" }}
      fade
      size="lg"
      isOpen={isOpen}
      toggle={onClose}
    >
      <ModalHeader toggle={onClose}>Update Tweeet</ModalHeader>
      <ModalBody className="py-0">{event.title}</ModalBody>
      <ModalFooter>
        <Button size="sm" color="secondary " onClick={onClose}>
          Close
        </Button>{" "}
        <Button size="sm" color="primary" onClick={onClose}>
          Schedule
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalUpdatePost;
