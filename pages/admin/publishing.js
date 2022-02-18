import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridMonthPlugin from "@fullcalendar/daygrid";
import listWeekPlugin from "@fullcalendar/list";
import boostrapPlugin from "@fullcalendar/bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { getRandomDate, getRandomHexColor } from "../../utils/formatter";

export default function Publishing() {
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
              events={Array.from({ length: 28 }).map((e, index) => {
                const date = getRandomDate(new Date(2022, 2, 1), new Date());
                return {
                  id: index,
                  title: "Do party",
                  start: new Date(2022, 1, index + 1),
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
              eventContent={CustomEvent}
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
function CustomEvent({ ...eventArgs }) {
  const { event } = eventArgs;
  return (
    <Card
      style={{
        width: "100%",
        textAlign: "center",
      }}
      className="text-primary shadow-lg rounded mx-1 mb-2"
    >
      <CardHeader
        style={{ color: getRandomHexColor() }}
        className="font-weight-bolder"
      >
        {event.title}
      </CardHeader>
    </Card>
  );
}
