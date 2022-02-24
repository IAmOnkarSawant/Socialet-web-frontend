import React from "react";
import toast from "react-hot-toast";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { deleteScheduledPosts } from "../../_api/schedule";

function ModalDelete({ eventId, isOpen, onCancel, onDelete, ...props }) {
  const handleDeleteTweet = () => {
    deleteScheduledPosts(eventId)
      .then(({ data }) => {
        toast.success("Scheduled tweet deleted successfully");
        onDelete();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      });
  };

  return (
    <Modal
      style={{ marginTop: "13%" }}
      fade
      size="md"
      isOpen={isOpen}
      toggle={onCancel}
    >
      <ModalHeader toggle={onCancel}>{props.title}</ModalHeader>
      <ModalBody className="py-0">{props.children}</ModalBody>
      <ModalFooter>
        <Button size="md" color="secondary" onClick={onCancel}>
          Cancel
        </Button>{" "}
        <Button
          size="md"
          color="danger"
          onClick={() => {
            handleDeleteTweet();
          }}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalDelete;
