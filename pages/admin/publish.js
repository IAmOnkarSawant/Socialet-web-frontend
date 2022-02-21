import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Navbar,
  NavbarBrand,
  Row,
  Tooltip,
  Badge,
} from "reactstrap";
import { BsEmojiSmile, BsTwitter } from "react-icons/bs";
import { FiCamera } from "react-icons/fi";
import {
  AiFillInfoCircle,
  AiFillPlusCircle,
  AiOutlineSchedule,
} from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { IoMdRemoveCircle, IoMdImages } from "react-icons/io";
import { MdNavigateNext, MdOutlineMessage } from "react-icons/md";
import { FaHashtag } from "react-icons/fa";
import EmptyPost from "../../components/Post/EmptyPost";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import ButtonLoader from "../../components/Loaders/ButtonLoader";
import { Picker } from "emoji-mart";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import {
  recommendHashtags,
  postTweet,
  scheduleTweet,
} from "../../_api/publish";
import { getTweetById, postReplyToTweet } from "../../_api/twitter";
import TwitterPreview from "../../components/Post/TwitterPreview";
import ReplyTweetCard from "../../components/Post/ReplyTweetCard";
import DatePicker from "react-datepicker";
import moment from "moment";
import toast from "react-hot-toast";
import { isSameDay, startOfToday, endOfDay } from "date-fns";

const DUMMY_DASHTAGS = ["#coolday", "#beach"];

const validationSchema = Yup.object({
  text: Yup.string()
    .required("Caption is required field")
    .test(
      "len",
      "you are exceeding the characters limit!",
      (val) => val && val.toString().length <= 280
    ),
});

function Publish() {
  const router = useRouter();
  const { query } = useRouter();
  const { data: session } = useSession();
  const [replyToTweet, setReplyToTweet] = useState(null);

  const calculateMinTime = (date) => {
    const now = new Date();
    // setting min time one minute from current time
    return isSameDay(date, now)
      ? now.setMinutes(now.getMinutes() + 1)
      : startOfToday();
  };

  const formik = useFormik({
    initialValues: {
      text: "",
      hashtags: [],
      images: [],
      isHashtagGenerating: false,
      isEmojiPanelOpen: false,
      isImagePanelOpen: false,
      isDatePickerOpen: false,
      scheduleDate: null,
      isScheduleDateSelected: false,
      isReply: false,
      minTime: calculateMinTime(new Date()),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.isReply) {
        let formData = new FormData();
        values.images.map(({ file }) => formData.append("files", file));

        formData.append("user_id", session.token.sub);
        formData.append("tweet_id", query.replyTo);

        const tweet = values.text + "\n" + values.hashtags.join(" ");
        formData.append("text", tweet);

        postReplyToTweet(formData).then(({ data }) => {
          // show success/error message in popup later
          if (data && data.error) {
            toast.error(data.message);
          } else {
            toast.success("Replied to Tweet Successfully!");
          }
          formik.resetForm();
          formik.setSubmitting(false);
        });
        return;
      }

      let formData = new FormData();
      values.images.map(({ file }) => formData.append("files", file));

      formData.append("user_id", session.token.sub);

      const tweet = values.text + "\n" + values.hashtags.join(" ");
      formData.append("text", tweet);
      if (values.isScheduleDateSelected) {
        let scheduleDate = new Date(values.scheduleDate).toUTCString();
        formData.append("scheduled_datetime", scheduleDate);
        formData.append("time_format", "utc");
        scheduleTweet(formData).then(({ data }) => {
          if (data && data.error) {
            toast.error(data.message);
          } else {
            toast.success("Tweet Scheduled Successfully!");
          }
          formik.resetForm();
          formik.setSubmitting(false);
        });
        return;
      }

      postTweet(formData).then(({ data }) => {
        if (data && data.error) {
          toast.error(data.message);
        } else {
          toast.success("Tweet Published Successfully!");
        }
        formik.resetForm();
        formik.setSubmitting(false);
      });
    },
  });

  const fetchReplyTweet = () => {
    getTweetById(query && query.replyTo, session.token.sub).then(({ data }) => {
      if (data && data.error) {
        // handle error case and display message that tweet does not exist anymore.
        console.log(data);
        formik.setFieldValue("isReply", false);
        return;
      }
      setReplyToTweet(data);
      formik.setFieldValue("isReply", true);
    });
  };
  const MAX_CAPTION_LENGTH = 280;

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleToolTip = () => setTooltipOpen(!tooltipOpen);

  const [tagValue, setTagValue] = useState("");

  const handleKeyDown = (e) => {
    if (!["Enter", "Tab"].includes(e.key)) return;

    if (["Enter", "Tab"].includes(e.key)) {
      e.preventDefault();
      const hashtag = "#" + tagValue.trim();
      if (formik.values.hashtags.includes(hashtag)) {
        formik.setFieldError("hashtags", "Tag already added");
        return;
      }
      if (!formik.values.hashtags.includes(hashtag)) {
        formik.setFieldValue(
          "hashtags",
          [...formik.values.hashtags, hashtag],
          true
        );
        setTagValue("");
      }
    }
  };

  const handleDelete = (item) => {
    formik.setFieldValue(
      "hashtags",
      formik.values.hashtags.filter((tag) => tag !== item)
    );
  };

  const handleTagChange = (e) => {
    formik.setFieldTouched("hashtags");
    setTagValue(e.target.value);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/jpg",
    onDrop: (files) => {
      formik.setFieldValue("images", [
        ...formik.values.images,
        ...files.map((file, index) => ({
          id: file.size + Math.random() + index,
          file,
          preview: URL.createObjectURL(file),
        })),
      ]);
    },
  });

  const handleImageDelete = (imageId) => {
    formik.setFieldValue(
      "images",
      formik.values.images.filter(({ id }) => id != imageId)
    );
  };

  const fetchHashtags = () => {
    let formData = new FormData();
    formik.values.images.map(({ file }) => formData.append("files", file));
    formik.setFieldValue("isHashtagGenerating", true);
    recommendHashtags(formData)
      .then(({ data }) => {
        if (data) {
          const hashtags = [...formik.values.hashtags, ...data.hashtags];
          formik.setFieldValue("hashtags", [...new Set(hashtags)]);
          formik.setFieldValue("isHashtagGenerating", false);
        }
      })
      .catch(() => {
        formik.setFieldValue("hashtags", [...DUMMY_DASHTAGS]);
      });
  };

  useEffect(() => {
    if (query && query.replyTo) {
      fetchReplyTweet();
    }
  }, [query.replyTo]);

  const handleEmojiPicker = useCallback(
    () => formik.setFieldValue("isEmojiPanelOpen", true),
    [formik]
  );

  const handleEmojiMart = (e) =>
    formik.setFieldValue("text", formik.values.text + e.native);

  const emojiRef = useRef();
  useOnClickOutside(emojiRef, () =>
    formik.setFieldValue("isEmojiPanelOpen", false)
  );

  return (
    <React.Fragment>
      <Navbar color="white" light expand="md">
        <NavbarBrand className="pl-4 font-weight-bold">New Post</NavbarBrand>
        <Button
          color="primary"
          outline
          style={{
            marginLeft: "auto",
            marginRight: 15,
          }}
          className="px-4"
          size="sm"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Navbar>
      <Container fluid>
        <Row>
          <Col
            lg="8"
            className="scrollbar py-3 pl-4 position-relative"
            style={{
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              background: "#F7FAFC",
            }}
          >
            <Card className="mb-4 py-2 px-3 d-flex flex-row align-items-center shadow-lg">
              <span
                style={{
                  width: "25px",
                  height: "25px",
                }}
                className="rounded-circle bg-default text-center text-white font-weight-normal"
              >
                G
              </span>
              <BsTwitter
                style={{ color: "rgb(29, 161, 242)" }}
                className="ml-2"
              />
              <p className="pl-2 mb-0 font-weight-bold text-dark">G11 SMWT</p>
              <p
                style={{ fontSize: "13px" }}
                className="pl-2 mb-0 font-weight-normal"
              >
                @SmwtG11
              </p>
            </Card>
            {replyToTweet && (
              <ReplyTweetCard id={replyToTweet?.id} tweet={replyToTweet} />
            )}
            <form onSubmit={formik.handleSubmit}>
              <FormGroup className="position-relative">
                <Card className="shadow-lg p-4 rounded-lg">
                  <Row className="mb-3">
                    <Col sm="1">
                      <MdOutlineMessage
                        style={{
                          fontSize: 50,
                          color: "#1d4ed8",
                          background: "#dbeafe",
                          padding: 12,
                          borderRadius: 5,
                        }}
                      />
                    </Col>
                    <Col sm="10">
                      <strong
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: 17,
                        }}
                        className="text-default d-block"
                      >
                        Create Post
                      </strong>
                      <span className="d-block" style={{ fontSize: 14 }}>
                        Create a high-performing post to get your message
                        across.
                      </span>
                    </Col>
                  </Row>
                  <Input
                    aria-label="With textarea"
                    rows={7}
                    color="secondary"
                    type="textarea"
                    name="text"
                    invalid={formik.touched.text && Boolean(formik.errors.text)}
                    placeholder="What would you like to share ?"
                    value={formik.values.text}
                    onChange={formik.handleChange}
                    style={{
                      background: "#F7FAFC",
                      border: "1px solid #CBD5E0",
                      borderBottom: 0,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    className="textarea"
                  ></Input>
                  <span
                    className="d-flex flex-row justify-content-end align-items-center p-3"
                    style={{
                      color:
                        MAX_CAPTION_LENGTH - formik.values.text.length >= 0
                          ? "gray"
                          : "red",
                      fontSize: 14,
                      background: "#F7FAFC",
                      border: "1px solid #CBD5E0",
                      borderTop: 0,
                      borderBottom: 0,
                    }}
                  >
                    {" "}
                    {MAX_CAPTION_LENGTH - formik.values.text.length}/{" "}
                    {MAX_CAPTION_LENGTH}{" "}
                  </span>
                  <div
                    style={{
                      border: "1px solid #CBD5E0",
                      borderTop: 0,
                    }}
                    className="rounded-bottom d-flex flex-row align-items-center p-3"
                  >
                    <BsEmojiSmile
                      onClick={handleEmojiPicker}
                      style={{
                        marginRight: 22,
                        fontSize: "20px",
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                    <FiCamera
                      onClick={() =>
                        formik.setFieldValue("isImagePanelOpen", true)
                      }
                      style={{
                        marginRight: 22,
                        fontSize: "20px",
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  {formik.values.isEmojiPanelOpen && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 1000000,
                        marginTop: "36%",
                      }}
                      ref={emojiRef}
                    >
                      <Picker onSelect={handleEmojiMart} emojiSize={22} />
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: 13,
                      color: "red",
                    }}
                    className="mt-1"
                  >
                    {" "}
                    {formik.touched.text && formik.errors.text}{" "}
                  </span>
                </Card>
              </FormGroup>
              {formik.values.isImagePanelOpen && (
                <FormGroup>
                  <Card className="shadow-lg p-4 rounded-lg">
                    <Row className="mb-3">
                      <Col sm="1">
                        <IoMdImages
                          style={{
                            fontSize: 50,
                            color: "#C49832",
                            background: "#FDF1D0",
                            padding: 12,
                            borderRadius: 5,
                          }}
                        />
                      </Col>
                      <Col sm="10">
                        <strong
                          style={{
                            fontFamily: "sans-serif",
                            fontSize: 17,
                          }}
                          className="text-default d-block"
                        >
                          Upload Images
                        </strong>
                        <span className="d-block" style={{ fontSize: 14 }}>
                          Upload Images to generate hashtags for better
                          engagement with customers.
                        </span>
                      </Col>
                    </Row>
                    <div className="d-flex flex-row flex-wrap">
                      {" "}
                      {formik.values.images.map(
                        ({ preview, id: imageId }, index) => (
                          <div
                            key={imageId}
                            style={{
                              width: "calc(20% - 8px)",
                              height: "100px",
                              position: "relative",
                            }}
                            className="mr-2 pb-2"
                          >
                            <img
                              className="rounded-sm"
                              style={{
                                width: "100%",
                                height: "100%",
                                filter: "brightness(.7)",
                              }}
                              src={preview}
                            />

                            <IoMdRemoveCircle
                              onClick={() => handleImageDelete(imageId)}
                              style={{
                                position: "absolute",
                                right: "5px",
                                top: "5px",
                                color: "rgba(222, 225, 225,0.9)",
                                cursor: "pointer",
                                fontSize: 20,
                              }}
                            />
                          </div>
                        )
                      )}
                      <div
                        className="mr-2 mb-2 rounded-sm border border-light"
                        style={{
                          width: "calc(20% - 8px)",
                          height:
                            formik.values.images.length === 0 ||
                            formik.values.images.length % 5 === 0
                              ? "85px"
                              : "auto",
                          position: "relative",
                          backgroundColor: "#f5f8fa",
                          cursor: "pointer",
                        }}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        <AiFillPlusCircle
                          size={25}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    </div>
                    <hr className="my-1" />
                    <ButtonLoader
                      className="px-4 mt-2"
                      onClick={fetchHashtags}
                      disabled={
                        formik.values.images.length === 0 ||
                        formik.values.isHashtagGenerating
                      }
                      type="button"
                      color="primary"
                      size="sm"
                      loading={formik.values.isHashtagGenerating}
                    >
                      {" "}
                      {formik.values.isHashtagGenerating
                        ? "Generating hashtags..."
                        : "Generate Hashtags"}{" "}
                    </ButtonLoader>
                  </Card>
                </FormGroup>
              )}
              <FormGroup>
                <Card className="shadow-lg p-4 mb-1 rounded-lg">
                  <Row className="mb-3">
                    <Col sm="1">
                      <FaHashtag
                        style={{
                          fontSize: 50,
                          color: "#3b82f6",
                          background: "#DAF7F7",
                          padding: 12,
                          borderRadius: 5,
                        }}
                      />
                    </Col>
                    <Col sm="10">
                      <strong
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: 17,
                        }}
                        className="text-default d-block"
                      >
                        Generate Hashtags
                      </strong>
                      <span className="d-block" style={{ fontSize: 14 }}>
                        Use AI to generate relevant hashtags.
                      </span>
                    </Col>
                    <Col sm="1" className="position-relative">
                      <AiFillInfoCircle
                        data-tip="Press Enter key or Tab key to add the hashtag"
                        size={15}
                        className="ml-1 mr-3"
                        id="infoToolTip"
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                        }}
                      />
                      <Tooltip
                        flip
                        placement="top"
                        isOpen={tooltipOpen}
                        target="infoToolTip"
                        toggle={toggleToolTip}
                      >
                        Press Enter or Tab key to add the hashtag
                      </Tooltip>
                    </Col>
                  </Row>
                  <div
                    className="hashtag__area position-relative mb-2 rounded-sm p-2"
                    style={{
                      border: "2px dashed #CBD5E0",
                      height: "112px",
                      overflowY: "auto",
                    }}
                  >
                    {" "}
                    {formik.values.hashtags.map((tag, i) => (
                      <Badge
                        style={{
                          width: "fit-content",
                          textTransform: "none",
                        }}
                        key={i}
                        pill
                        color="primary"
                        className="badge-sm pl-3 pr-2 mr-2 mb-1"
                      >
                        {" "}
                        {tag}
                        <IoCloseOutline
                          onClick={() => handleDelete(tag)}
                          size={15}
                          style={{ cursor: "pointer" }}
                          className="ml-2"
                        />
                      </Badge>
                    ))}
                    {formik.values.hashtags.length === 0 && (
                      <span
                        style={{
                          fontSize: 16,
                          color: "gray",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        No hashtags added/generated.
                      </span>
                    )}{" "}
                  </div>
                  <Input
                    onKeyDown={handleKeyDown}
                    color="default"
                    value={tagValue}
                    name="hashtags"
                    invalid={
                      formik.touched.hashtags && Boolean(formik.errors.hashtags)
                    }
                    onChange={handleTagChange}
                    placeholder="Enter Hashtag Here"
                  ></Input>
                  <FormFeedback>
                    {" "}
                    {formik.touched.hashtags && formik.errors.hashtags}{" "}
                  </FormFeedback>
                </Card>
              </FormGroup>
              <Card className="shadow-lg p-4 mb-1 rounded-lg">
                <Row className="mb-3">
                  <Col sm="1">
                    <AiOutlineSchedule
                      style={{
                        fontSize: 50,
                        color: "#3b82f6",
                        background: "#DAF7F7",
                        padding: 12,
                        borderRadius: 5,
                      }}
                    />
                  </Col>
                  <Col sm="11">
                    <strong
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: 17,
                      }}
                      className="text-default d-block"
                    >
                      Schedule
                    </strong>
                    <span className="d-block" style={{ fontSize: 14 }}>
                      Select publishing time as per your need.
                    </span>
                  </Col>
                  <Col sm="12" className="mt-4">
                    {formik.values.isScheduleDateSelected ? (
                      <Row className="pl-3">
                        <Button
                          onClick={() => {
                            formik.setFieldValue(
                              "isScheduleDateSelected",
                              false
                            );
                            formik.setFieldValue("scheduleDate", null);
                          }}
                          outline
                          color="danger"
                          type="button"
                        >
                          Clear Schedule
                        </Button>
                        <Button color="primary" type="submit">
                          {" "}
                          {query && query.replyTo
                            ? "Schedule Reply"
                            : "Schedule Post"}{" "}
                        </Button>
                      </Row>
                    ) : (
                      <Row className="pl-3">
                        <Button
                          onClick={() =>
                            formik.setFieldValue(
                              "isDatePickerOpen",
                              !formik.values.isDatePickerOpen
                            )
                          }
                          outline
                          color="primary"
                          type="button"
                        >
                          Pick Time
                        </Button>
                        <ButtonLoader
                          loading={formik.isSubmitting}
                          color="primary"
                          type="submit"
                          disabled={formik.isSubmitting || formik.isValidating}
                        >
                          {query && query.replyTo ? "Reply Now" : "Post Now"}
                        </ButtonLoader>
                      </Row>
                    )}
                  </Col>
                </Row>
                <div className="d-flex flex-row align-items-start mb-2">
                  <div
                    className={`p-3 border shadow rounded ${
                      !formik.values.isDatePickerOpen ? "d-none" : "d-block"
                    }`}
                    style={{ width: "fit-content" }}
                  >
                    <DatePicker
                      inline
                      minDate={moment().toDate()}
                      renderCustomHeader={(args) => (
                        <DayPickerHeader {...args} />
                      )}
                      selected={formik.values.scheduleDate}
                      onChange={(date) => {
                        console.log(date);
                        formik.setFieldValue("scheduleDate", date);
                      }}
                      disabledKeyboardNavigation
                    />
                  </div>
                  <div
                    className={`mx-3 border shadow rounded ${
                      !formik.values.isDatePickerOpen ? "d-none" : "d-block"
                    }`}
                  >
                    <DatePicker
                      inline
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={1}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      minTime={formik.values.minTime}
                      maxTime={endOfDay(new Date())}
                      selected={
                        formik.values.scheduleDate
                          ? formik.values.scheduleDate
                          : formik.values.minTime
                      }
                      onChange={(date) => {
                        console.log(date);
                        formik.setFieldValue("scheduleDate", date);
                        formik.setFieldValue("isScheduleDateSelected", true);
                        formik.setFieldValue("isDatePickerOpen", false);
                        formik.setFieldValue("minTime", calculateMinTime(date));
                      }}
                      disabledKeyboardNavigation
                    />
                  </div>
                </div>
                {formik.values.scheduleDate !== null && (
                  <Badge
                    style={{ width: "fit-content" }}
                    className="px-4"
                    pill
                    color="primary badge-md"
                  >
                    {" "}
                    {moment(formik.values.scheduleDate).format("llll")}{" "}
                  </Badge>
                )}{" "}
              </Card>
            </form>
          </Col>
          <Col
            lg="4"
            className="py-3 pr-4"
            style={{
              height: "calc(100vh - 64px)",
              background: "#EDF2F7",
            }}
          >
            <p className="font-weight-bold text-dark">Network Preview</p>
            <div className="d-flex flex-row justify-content-start">
              <AiFillInfoCircle size={25} className="mr-2" />
              <p
                className="font-weight-bold"
                style={{
                  fontSize: "13px",
                  color: "black",
                }}
              >
                Preview approximates how your content will display when
                published. Tests and updates by social networks may affect the
                final appearance.
              </p>
            </div>
            <div style={{ marginLeft: "4%" }}>
              {" "}
              {formik.values.text ||
              (formik.values.hashtags && formik.values.hashtags.length > 0) ||
              (formik.values.images && formik.values.images.length > 0) ? (
                <TwitterPreview
                  hashtags={formik.values.hashtags}
                  text={formik.values.text}
                  images={formik.values.images}
                />
              ) : (
                <EmptyPost />
              )}{" "}
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
Publish.requireAuth = true;
export default Publish;
const DayPickerHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  return (
    <div className="mx-3 mb-3 d-flex flex-row justify-content-between align-items-center ">
      <MdNavigateNext
        onClick={decreaseMonth}
        style={{
          cursor: "pointer",
          color: prevMonthButtonDisabled ? "lightgray" : "#5E72E4",
          pointerEvents: prevMonthButtonDisabled && "none",
          fontSize: 23,
          fontWeight: "bolder",
          transform: "rotate(180deg)",
        }}
      />

      <strong className="text-dark">
        {" "}
        {date.toLocaleString("default", { month: "short" })}{" "}
        {date.getFullYear()}{" "}
      </strong>

      <MdNavigateNext
        style={{
          cursor: "pointer",
          color: "#5E72E4",
          fontSize: 23,
          fontWeight: "bolder",
        }}
        onClick={increaseMonth}
      />
    </div>
  );
};
