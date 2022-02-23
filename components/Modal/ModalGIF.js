import React from "react";
import toast from "react-hot-toast";
import Tenor from "react-tenor";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function ModalGIF({ isOpen, setIsOpen: callback, formik, ...props }) {
  return (
    <Modal fade size="lg" isOpen={isOpen} toggle={callback}>
      <ModalHeader toggle={callback}>GIF Picker</ModalHeader>
      <ModalBody className="py-0">
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Tenor
            token="DL9UEB8V9PGP" // Need to be added in .env file 😉
            onSelect={({ media }) => {
              console.log(media);
              if (formik.values.GIFs.length >= 1) {
                toast.error("You could only add 1 GIF");
                return;
              }
              if (
                formik.values.GIFs.findIndex(
                  (gif) => gif === media[0]["gif"]["url"]
                ) > -1
              ) {
                toast.error("GIF is already added");
                return;
              }
              return formik.setFieldValue("GIFs", [
                ...formik.values.GIFs,
                media[0]["gif"]["url"],
              ]);
            }}
            searchPlaceholder="Search GIFs here..."
            initialSearch="bro"
          />
        </div>
        <hr />
        <div className="react-tenor--results">
          {!!formik?.values?.GIFs?.length ? (
            formik?.values?.GIFs?.map((url, index) => (
              <img
                onClick={() =>
                  formik.setFieldValue("GIFs", [
                    ...formik.values.GIFs.filter((gif) => gif !== url),
                  ])
                }
                style={{ objectFit: "unset" }}
                className="react-tenor--result border rounded"
                key={index}
                src={url}
              />
            ))
          ) : (
            <p className="text-danger h3">No GIFs selected</p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          size="md"
          onClick={() => {
            callback();
            formik.setFieldValue("GIFs", []);
          }}
        >
          Cancel
        </Button>
        <Button color="primary" size="md" onClick={callback}>
          Proceed
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default React.memo(ModalGIF);
