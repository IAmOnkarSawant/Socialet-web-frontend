import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridMonthPlugin from "@fullcalendar/daygrid";
import listWeekPlugin from "@fullcalendar/list";
import boostrapPlugin from "@fullcalendar/bootstrap";
import {
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
import { getRandomHexColor } from "../../utils/formatter";
import React, { useEffect, useState } from "react";
import { getScheduledPosts } from "../../_api/schedule";
import ModalDelete from "../../components/Modal/ModalDelete";
import ModalUpdatePost from "../../components/Modal/ModalUpdatePost";
import { useSession } from "next-auth/react";

const EVENTS = Array.from({ length: 27 }).map((e, index) => ({
  id: index,
  text: "Do party",
  start: new Date(2022, 1, index + 1),
  interactive: true,
}));

export default function Publishing() {
  const { data: session } = useSession();
  console.log(session);
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

  const handleSchedulePost = ({ ...args }) => {
    // you can shedule post on clicking date block...
    // you can access selected date arguments(start and end date in ISO as well as string format) here...
    console.log(args);
  };

  const handleEventClick = ({ ...args }) => {
    // triggers when user clicks on event...
    console.log(args.event.start);
  };

  const handleReshedulePost = ({ ...args }) => {
    // triggers when user drag certain event from one day to another...
    console.log(args);
  };

  const filterTweets = (id) => {
    const new_tweets = scheduledTweets.filter((tweet) => tweet._id !== id);
    setScheduledTweets([...new_tweets]);
  };

  return (
    <Container fluid className="my-4">
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
              eventBackgroundColor="transparent"
              eventBorderColor="transparent"
              themeSystem="bootstrap"
              events={[...scheduledTweets]
                .filter((e) => e.published === false)
                .map((event, index) => {
                  return {
                    id: event._id,
                    title: event.text,
                    start: new Date(event.scheduled_datetime),
                    interactive: true,
                  };
                })}
              headerToolbar={{
                left: "prev,next today prevYear,nextYear",
                center: "title",
                right: "dayGridMonth,listWeek",
              }}
              dateClick={handleSchedulePost}
              eventClick={handleEventClick}
              eventContent={(args) => (
                <CustomEvent {...args} callback={filterTweets} />
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
function CustomEvent({ callback, ...eventArgs }) {
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
          callback(event.id);
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
      />
      <Card
        style={{
          width: "100%",
          textAlign: "center",
        }}
        className="text-primary shadow-lg rounded mx-1 mb-2"
      >
        <CardHeader
          style={{ color: getRandomHexColor(), wordWrap: "break-word" }}
          className="font-weight-bolder"
        >
          {event.title.substring(0, 20) + "..."}
        </CardHeader>
        <CardFooter>
          <Button
            size="sm"
            color="danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>{" "}
          <Button
            size="sm"
            color="primary"
            onClick={() => setIsUpdateModalOpen(true)}
          >
            Update
          </Button>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
}
