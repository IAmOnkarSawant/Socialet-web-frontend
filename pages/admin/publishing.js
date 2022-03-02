import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridMonthPlugin from "@fullcalendar/daygrid";
import listWeekPlugin from "@fullcalendar/list";
import boostrapPlugin from "@fullcalendar/bootstrap";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import {
  formatAMPM,
  getRandomHexColor,
  truncateString,
} from "../../utils/formatter";
import React, { useCallback, useEffect, useState } from "react";
import { getScheduledPosts, reScheduledPosts } from "../../_api/schedule";
import ModalDelete from "../../components/Modal/ModalDelete";
import ModalUpdatePost from "../../components/Modal/ModalUpdatePost";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default function Publishing() {
  const router = useRouter();
  const { data: session } = useSession();
  const [scheduledTweets, setScheduledTweets] = useState([]);

  useEffect(() => {
    if (session?.token?.sub) {
      getScheduledPosts(session?.token?.sub)
        .then(({ data }) => {
          console.log(data);
          setScheduledTweets([...data]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [session?.token?.sub]);

  const handleEventClick = ({ ...args }) => {
    // triggers when user clicks on event...
    console.log(args);
  };

  const filterTweets = useCallback(
    (id) => {
      const new_tweets = scheduledTweets.filter((tweet) => tweet._id !== id);
      setScheduledTweets([...new_tweets]);
    },
    [scheduledTweets]
  );

  const updatedTweetOnEdit = useCallback(
    (id, updatedTweet) => {
      const filtered_tweets = scheduledTweets.map((tweet) =>
        tweet._id === id ? { ...updatedTweet } : { ...tweet }
      );
      setScheduledTweets([...filtered_tweets]);
    },
    [scheduledTweets]
  );

  const handleSchedulePost = ({ ...args }) => {
    console.log(args);
  };

  const handleReshedulePost = ({ event: newEvent, oldEvent, ...args }) => {
    console.log(args);
    const bodyData = {
      id: newEvent.id || oldEvent.id,
      scheduled_datetime: new Date(newEvent.startStr).toUTCString(), // updated date || resheduled date
      timeformat:
        newEvent.extendedProps.timeformat || oldEvent.extendedProps.timeformat,
    };
    reScheduledPosts(bodyData)
      .then(({ data }) => {
        console.log(data);
        // need to update local state! Remember!!
        const updatedDateInScheduledTweets = [...scheduledTweets].map((tweet) =>
          tweet._id === data._id
            ? { ...tweet, scheduled_datetime: data["scheduled_datetime"] }
            : { ...tweet }
        );
        setScheduledTweets([...updatedDateInScheduledTweets]);
        !data.error
          ? toast.success("Tweet resheduled successfully")
          : toast.error("Tweet could't resheduled");
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <Card className="rounded-lg shadow-lg p-4">
            <FullCalendar
              plugins={[
                interactionPlugin,
                timeGridPlugin,
                dayGridMonthPlugin,
                listWeekPlugin,
                boostrapPlugin,
              ]}
              initialView="dayGridMonth"
              selectable={false}
              editable
              droppable
              showNonCurrentDates={false}
              eventBackgroundColor="transparent"
              eventBorderColor="transparent"
              themeSystem="bootstrap"
              events={[...scheduledTweets]
                .filter((e) => e.published === false)
                .map((event, index) => {
                  return {
                    id: event._id,
                    title: event.text,
                    // here dates are formatted because UTC date string is not supported in fullcalender.js
                    date: new Date(event.scheduled_datetime).toISOString(),
                    start: new Date(event.scheduled_datetime).toISOString(),
                    end: new Date(event.scheduled_datetime).toISOString(),
                    overlap: true,
                    interactive: true,
                    extendedProps: {
                      _id: event._id,
                      user_id: event.user_id,
                      files: event.files,
                      published: event.published,
                      expired: event.expired,
                      isReply: event.isReply,
                      timeformat: event.timeformat,
                      replyTweetId: event.replyTweetId,
                      // here dates are formatted because UTC date string is not supported in fullcalender.js
                      dateTime: new Date(
                        event.scheduled_datetime
                      ).toISOString(),
                    },
                  };
                })}
              headerToolbar={{
                left: "prev,next today prevYear,nextYear",
                center: "title",
                right: "dayGridMonth,timeGridDay,listWeek",
              }}
              dateClick={handleSchedulePost}
              eventClick={handleEventClick}
              expandRows={false}
              eventContent={(args) => (
                <CustomEvent
                  {...args}
                  updatedTweetOnEdit={updatedTweetOnEdit}
                  filterTweets={filterTweets}
                />
              )}
              eventDrop={handleReshedulePost}
              dragScroll
              firstDay={1}
              navLinks
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// customize event displayer
function CustomEvent({ filterTweets, updatedTweetOnEdit, ...eventArgs }) {
  const { event } = eventArgs;
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  return (
    <React.Fragment>
      {/* Delete Modal */}
      <ModalDelete
        title="Delete Tweet"
        onCancel={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          setIsDeleteModalOpen(false);
          filterTweets(event.id);
        }}
        isOpen={isDeleteModalOpen}
        eventId={event.id}
      >
        You are about to delete the tweet. Are you sure?
      </ModalDelete>
      {/* Update Modal */}
      <ModalUpdatePost
        event={event}
        onClose={() => setIsUpdateModalOpen(false)}
        isOpen={isUpdateModalOpen}
        onUpdate={updatedTweetOnEdit}
      />
      <Card
        style={{
          width: "100%",
        }}
        className="text-primary shadow-lg rounded mx-1 mb-2"
      >
        <CardHeader
          style={{ color: "black" }}
          className="font-weight-bolder py-2 px-3"
        >
          <Badge className="badge-sm bg-default text-white text-right font-weight-bolder mb-1">
            {formatAMPM(new Date(event.extendedProps.dateTime))}
          </Badge>
          <div
            className="text-wrap font-weight-bold"
            dangerouslySetInnerHTML={{
              __html: truncateString(event.title, 45),
            }}
          />
          <div className="d-flex flex-row flex-wrap mt-2">
            {event.extendedProps?.files?.map((image, index) => (
              <img
                className="rounded-sm shadow-lg"
                width="60px"
                key={index}
                src={image}
                alt={`${image}_${index}`}
              />
            ))}
          </div>
        </CardHeader>
        <CardFooter className="py-2 px-3">
          <Button
            size="sm mx-0"
            color="danger"
            onClick={() => setIsDeleteModalOpen(true)}
            outline
            className="rounded-sm shadow-lg"
          >
            Delete
          </Button>{" "}
          <Button
            size="sm ml-1"
            color="primary"
            onClick={() => setIsUpdateModalOpen(true)}
            outline
            className="rounded-sm shadow-lg"
          >
            Update
          </Button>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
}
