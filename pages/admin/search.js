import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Navbar,
  NavbarBrand,
  Row,
  Spinner,
} from "reactstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSession } from "next-auth/react";
import { getSearchResults } from "../../_api/twitter";
import TwitterCard from "../../components/Post/TwitterSearchCard";
import ButtonLoader from "../../components/Loaders/ButtonLoader";
import {
  formatHashtag,
  removeDuplicatesFromArrayOfObjects,
} from "../../utils/formatter";
import CenterSpinner from "../../components/Loaders/CenterSpinner";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { emotionRecogniser } from "../../_api/emotions";
import AnalysisCard from "../../components/AnalysisCard/AnalysisCard";

const validationSchema = yup.object({
  searchTerm: yup
    .string()
    .test(
      "len",
      "Your search term must consist of 3 or more characters.",
      (val) => val && val.length >= 3
    ),
});

function search() {
  const router = useRouter();
  const { query } = useRouter();
  const { data: session } = useSession({ required: true });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPostAvailable, setIsNewPostAvailable] = useState(false);

  const formik = useFormik({
    initialValues: {
      searchTerm: "",
      tweets: [],
      pieData: {},
      isSearching: false,
      isEmotionsFetched: false,
    },
    validationSchema: validationSchema,
    onSubmit: ({ searchTerm }) => {
      formik.setFieldValue("isSearching", true);
      const newSearchTerm = formatHashtag(searchTerm);
      getSearchResults(session.token.sub, page, newSearchTerm).then(
        ({ data: { searched_tweets } }) => {
          console.log(searched_tweets);
          formik.setFieldValue("isSearching", false);
          formik.setFieldValue("tweets", [...searched_tweets]);
          formik.setSubmitting(false);
          setHasMore(searched_tweets.length > 0);
          setIsLoading(false);
          setIsNewPostAvailable(searched_tweets.length > 0);
        }
      );
    },
  });

  const recogniseTweetEmotion = () => {
    const tweets = formik.values.tweets.map((f) => ({
      tweet: f.full_text,
      id: f.id,
    }));
    emotionRecogniser({ tweets }).then(({ data }) => {
      console.log(data);
      formik.setFieldValue("pieData", data.chart_data);
      const resp = formik.values.tweets.map((tweet) => {
        const emoji = [...data.tweets].find((t) => {
          if (t.id === tweet.id) {
            return t;
          }
        });
        console.log(emoji["emotion"]);

        return {
          ...tweet,
          emotion: emoji["emotion"],
        };
      });
      console.log(resp);
      formik.setFieldValue("tweets", [...resp]);
      formik.setFieldValue("isEmotionsFetched", true);
    });
  };

  useEffect(() => {
    if (isNewPostAvailable) {
      recogniseTweetEmotion();
      setIsNewPostAvailable(false);
    }
  }, [isNewPostAvailable]);

  useEffect(() => {
    if (query && query.searchTerm) {
      formik.setFieldValue(
        "searchTerm",
        query.searchTerm.replace("hashtag", "#")
      );
      setTimeout(() => {
        formik.handleSubmit();
      }, 200);
    }
    return () => {
      setPage(0);
    };
  }, [query]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 1,
  });

  useEffect(() => {
    if (inView && hasMore) setPage((page) => page + 1);
  }, [inView]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    let isMounted = true;
    setIsLoading(true);
    const newSearchTerm = formatHashtag(formik.values.searchTerm);
    getSearchResults(session?.token?.sub, page, newSearchTerm, {
      cancelToken: source.token,
    })
      .then(({ data }) => {
        console.log(data);
        if (isMounted) {
          formik.setFieldValue("tweets", [
            ...removeDuplicatesFromArrayOfObjects(
              [...formik.values.tweets, ...data.searched_tweets],
              "id"
            ),
          ]);
          setHasMore(data.searched_tweets.length > 0);
          setIsLoading(false);
          setIsNewPostAvailable(data.searched_tweets.length > 0);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (axios.isCancel(err)) console.log(err);
        else console.log(err);
      });
    return () => {
      isMounted = false;
      source.cancel();
    };
  }, [page]);

  return (
    <React.Fragment>
      <Navbar color="white" light expand="md">
        <NavbarBrand className="font-weight-bold">
          {formik.values.searchTerm && formik.values.tweets.length > 0
            ? formik.values.searchTerm
            : "Twitter Search"}
        </NavbarBrand>
        <div style={{ marginLeft: "auto" }}>
          {formik.values.tweets.length > 0 && (
            <Button
              color="primary"
              className="mb-3 px-4"
              outline
              style={{ marginLeft: "auto", marginRight: 15 }}
              size="sm"
              onClick={() => {
                formik.setFieldValue("tweets", []);
                if (query) {
                  window.history.replaceState(null, "", "/dashboard/search");
                }
              }}
            >
              Search Keyword
            </Button>
          )}
          <Button
            color="primary"
            className="mb-3 px-4"
            outline
            style={{ marginLeft: "auto", marginRight: 15 }}
            size="sm"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      </Navbar>
      {formik.values.isSearching && (
        <div
          style={{ width: "100%" }}
          className="d-flex flex-row justify-content-center align-items-center"
        >
          <Spinner color="default" size="lg" style={{ marginTop: "5%" }} />
        </div>
      )}
      <Container fluid="sm" className="mt-4">
        <Row>
          {formik.values.pieData &&
            formik.values.tweets.length !== 0 &&
            formik.values.isEmotionsFetched && (
              <Col md="12" className="mb-4">
                <AnalysisCard data={formik.values.pieData} />
              </Col>
            )}
          {formik.values.tweets.length !== 0 && !formik.values.isSearching ? (
            <Col md="12">
              {formik.values.tweets.map((tweet, index) => {
                if (index === formik.values.tweets.length - 1) {
                  return (
                    <TwitterCard
                      ref={ref}
                      key={tweet.id}
                      tweet={tweet}
                      search={true}
                      formik={formik}
                      callback={formik.handleSubmit}
                      setPage={setPage}
                      isEmotionShow
                    />
                  );
                }
                return (
                  <TwitterCard
                    key={tweet.id}
                    tweet={tweet}
                    search={true}
                    formik={formik}
                    callback={formik.handleSubmit}
                    setPage={setPage}
                    isEmotionShow
                  />
                );
              })}
              {isLoading && hasMore && (
                <CenterSpinner
                  style={{ width: "100%", marginTop: 10, marginBottom: 20 }}
                  type="border"
                  size="md"
                  color="default"
                />
              )}
            </Col>
          ) : (
            !formik.values.isSearching && (
              <Col md="12">
                <Card className="shadow-lg">
                  <CardHeader>
                    <span className="text-dark font-weight-bold">
                      Create New
                    </span>
                    <div style={{ fontSize: 13 }} className="pt-2">
                      Find conversations to join and people to engage with by
                      searching for keywords related to your business or
                      industry.
                    </div>
                  </CardHeader>
                  <CardBody>
                    <CardTitle className="mb-1" tag="h5">
                      New Search
                    </CardTitle>
                    <div style={{ fontSize: 13 }}>
                      Utilize keywords or phrases that your customers would be
                      talking about.
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                      <Row className="mt-3">
                        <Col md={9}>
                          <FormGroup>
                            <Input
                              name="searchTerm"
                              placeholder="Enter word or phrase..."
                              bsSize="md"
                              color="primary"
                              value={formik.values.searchTerm}
                              onChange={formik.handleChange}
                              invalid={
                                formik.touched.searchTerm &&
                                Boolean(formik.errors.searchTerm)
                              }
                            />
                            <FormFeedback>
                              {formik.touched.searchTerm &&
                                formik.errors.searchTerm}
                            </FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <ButtonLoader
                            disabled={
                              formik.isSubmitting || formik.isValidating
                            }
                            type="submit"
                            loading={formik.values.isSearching}
                          >
                            {formik.values.isSearching
                              ? "Searching..."
                              : "Search"}
                          </ButtonLoader>
                        </Col>
                      </Row>
                    </form>
                  </CardBody>
                </Card>
              </Col>
            )
          )}
        </Row>
      </Container>
    </React.Fragment>
  );
}

export default search;
