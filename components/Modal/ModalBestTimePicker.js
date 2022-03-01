import moment from "moment";
import React from "react";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

function ModalBestTimePicker({ isOpen, onClose }) {
  return (
    <Modal fade size="md" isOpen={isOpen} toggle={onClose}>
      <ModalHeader className="" toggle={onClose}>
        Best hours to post
      </ModalHeader>
      <ModalBody className="my-0 py-0">
        <Badge
          style={{ width: "100%" }}
          className="mb-4"
          pill
          color="primary badge-lg"
        >
          {moment().format("llll")}
        </Badge>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} size="md" color="primary">
          Proceed
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalBestTimePicker;
