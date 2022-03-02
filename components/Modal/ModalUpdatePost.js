import { useFormik } from "formik";
import React, { useMemo } from "react";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { updateScheduledPosts } from "../../_api/schedule";
import * as yup from "yup";
import moment from "moment";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { isImageURL } from "../../utils/formatter";
import { AiFillPlusCircle } from "react-icons/ai";

const validationSchema = yup.object({
  text: yup.string().required("Tweet is required"),
  scheduledDateTime: yup.date().required("Scheduled DateTime is required"),
});

function ModalUpdatePost({ event, isOpen, onClose, onUpdate, ...props }) {
  const formik = useFormik({
    initialValues: {
      text: event.title,
      scheduledDateTime: moment(event.extendedProps.dateTime).format(
        "YYYY-MM-DDTkk:mm"
      ),
      images:
        event.extendedProps.files && event.extendedProps.files.length !== 0
          ? event.extendedProps.files
          : [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, helpers) => {
      const bodyData = {
        id: event.extendedProps._id,
        user_id: event.extendedProps.user_id,
        text: values.text, //
        scheduled_datetime: new Date(values.scheduledDateTime).toUTCString(), //
        isReply: event.extendedProps.isReply,
        files: values.images, //
        published: event.extendedProps.published,
        expired: event.extendedProps.expired,
        timeformat: event.extendedProps.timeformat,
        replyTweetId: event.extendedProps.replyTweetId,
      };
      console.log(values);
      try {
        const { data } = await updateScheduledPosts(bodyData);
        onClose();
        onUpdate(event.extendedProps._id, data);
        toast.success("Tweet updated successfully");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*, video/*",
    onDrop: (files) => {
      formik.setFieldValue("images", [
        ...formik.values.images,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    },
  });

  return (
    <Modal fade size="lg" isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Update Tweeet</ModalHeader>
      <ModalBody className="py-0">
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col sm="12">
              <FormGroup className="mb-1">
                <Label
                  className="font-weight-bold mb-2"
                  style={{ fontSize: "13px" }}
                >
                  Tweet
                </Label>
                <Input
                  name="text"
                  type="textarea"
                  placeholder="Enter tweet here..."
                  value={formik.values.text}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.text && Boolean(formik.errors.text)}
                  className="form-control-alternative scrollbar"
                />
                <FormFeedback>
                  {formik.touched.text && formik.errors.text}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup className="mb-1">
                <Label
                  className="font-weight-bold mb-2"
                  style={{ fontSize: "13px" }}
                >
                  Scheduled Time
                </Label>
                <Input
                  name="scheduledDateTime"
                  type="datetime-local"
                  placeholder="Enter Scheduled Time here..."
                  value={moment(formik.values.scheduledDateTime).format(
                    "YYYY-MM-DDTkk:mm"
                  )}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.scheduledDateTime &&
                    Boolean(formik.errors.scheduledDateTime)
                  }
                  className="form-control-alternative"
                />
                <FormFeedback>
                  {formik.touched.scheduledDateTime &&
                    formik.errors.scheduledDateTime}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="12">
              <div
                className="font-weight-bold mt-2 mb-2"
                style={{ fontSize: "13px" }}
              >
                Upload Images
              </div>
              <div
                className="mr-2 mb-2 rounded-sm shadow-lg position-relative"
                style={{ width: "100%", height: "120px", background: "white" }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <AiFillPlusCircle
                  className="position-absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    fontWeight: "25px",
                  }}
                />
              </div>
              <div className="d-flex flex-row flex-wrap align-items-center mt-2">
                {formik.values.images && formik.values.images.length !== 0 ? (
                  formik.values.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={"image_" + index}
                      className="rounded-sm mr-2"
                      style={{
                        width: "140px",
                        height: "85px",
                        objectFit: "cover",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    />
                  ))
                ) : (
                  <span
                    style={{ fontSize: "14px" }}
                    className="font-weight-bold text-danger"
                  >
                    No images found
                  </span>
                )}
              </div>
            </Col>
          </Row>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" size="md" color="secondary " onClick={onClose}>
          Close
        </Button>{" "}
        <Button onClick={formik.handleSubmit} size="md" color="primary">
          Schedule
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default React.memo(ModalUpdatePost);
