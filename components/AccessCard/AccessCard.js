import React from "react";
import { useRouter } from "next/router";
import { Button, Card, Container } from "reactstrap";

function AccessCard() {
  const router = useRouter();
  return (
    <React.Fragment>
      <div className="header bg-gradient-dark pb-6 pt-4 pt-md-8" />
      <Container fluid="md">
        <Card className="shadow-lg rounded-lg p-4 mt--5">
          <p className="text-center h3 text-muted">
            You have no access to see{" "}
            <span className="text-danger">{router?.pathname}</span>. <br />{" "}
            Please connect your social media account first.
          </p>
          <Button
            onClick={() => router.push("/admin/channels")}
            color="primary"
            size="sm"
            className="mx-auto px-4 mt-4"
          >
            Go to channels page
          </Button>
        </Card>
      </Container>
    </React.Fragment>
  );
}

export default AccessCard;
