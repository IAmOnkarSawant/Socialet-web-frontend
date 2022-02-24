import { useFormik } from "formik";
import React from "react";
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
    },
    validationSchema: validationSchema,
    onSubmit: async (values, helpers) => {
      const bodyData = {
        id: event.extendedProps._id,
        user_id: event.extendedProps.user_id,
        text: values.text, //
        scheduled_datetime: values.scheduledDateTime, //
        isReply: event.extendedProps.isReply,
        files: event.extendedProps.files,
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

  return (
    <Modal
      style={{ marginTop: "13%" }}
      fade
      size="lg"
      isOpen={isOpen}
      toggle={onClose}
    >
      <form onSubmit={formik.handleSubmit}>
        <ModalHeader toggle={onClose}>Update Tweeet</ModalHeader>
        <ModalBody className="py-0">
          <Row>
            <Col sm="12">
              <FormGroup className="mb-1">
                <Label
                  className="font-weight-bold"
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
                  // className='form-control-alternative'
                />
                <FormFeedback>
                  {formik.touched.text && formik.errors.text}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup className="mb-1">
                <Label
                  className="font-weight-bold"
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
                  // className='form-control-alternative'
                />
                <FormFeedback>
                  {formik.touched.scheduledDateTime &&
                    formik.errors.scheduledDateTime}
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" size="md" color="secondary " onClick={onClose}>
            Close
          </Button>{" "}
          <Button type="submit" size="md" color="primary">
            Schedule
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default React.memo(ModalUpdatePost);
