import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";

import RefreshIcon from "@mui/icons-material/Refresh";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import NewsItemCard from "../../components/NewsItemCard";
import finFeedLogo from "../../../public/images/finFeedLogo.png";

const Dashboard = (props) => {
  const [feed, setFeed] = useState("cnbc");
  const [items, setItems] = useState([]);
  // const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const intervalID = setInterval(
      //function to refresh feed every 3 minutes
      () => {
        if (feed !== null) {
          GetNewsReports(feed);
        }
      },
      180000
    );
    return () => clearInterval(intervalID);
  }, [feed]);

  //function to set named entities
  // const GetEntities = async (result) => {
  //   let final = [];

  //   await Promise.allSettled(
  //     result.map(async (item) => {
  //       const emoRes = await axios.post(
  //         "https://api.text-miner.com/ner",
  //         `message=${item.text}`,
  //         {
  //           headers: {
  //             "Content-Type": "application/x-www-form-urlencoded"
  //           }
  //         }
  //       );
  //       setEntities((prev) => {
  //         return [...prev, emoRes.data];
  //       });
  //       final.push({ ...item, entities: emoRes.data });
  //     })
  //   );
  //   // setItems(final)
  //   setLoading(false);
  // };

  //function to get news text, and sentiment score for each news
  const GetNewsReports = async (provider) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://biz-api.text-miner.com/finfeed/${provider}`
      );
      let result = [];
      await Promise.allSettled(
        JSON.parse(res.data).map(async (item, i) => {
          const itemArray = item.split("\t");
          let currObject = {
            text: itemArray[0],
            date: itemArray[1]
          };
          const response = await axios.post(
            "https://api.text-miner.com/sentiment",
            `message=${currObject.text}`,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            }
          );
          let pos = response.data.positive_sentiment_percentage;
          let neg = response.data.negative_sentiment_percentage;
          currObject = { ...currObject, pos: pos, neg: neg };
          result.push(currObject);
        })
      );
      setItems(result);
      setLoading(false);

      // GetEntities(result)
    } catch (error) {
      console.error(error);
    }
  };

  //function called whenever news provider is changed
  const fetchNewsOnClick = (event) => {
    // setEntities([]);
    setFeed(event.target.value);
    const provider = event.target.value;
    GetNewsReports(provider);
  };

  function sortDataByDate(data, order) {
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (order === "asc") {
        return dateA - dateB;
      } else if (order === "desc") {
        return dateB - dateA;
      } else {
        throw new Error(`Invalid order: ${order}`);
      }
    });
    return sortedData;
  }

  function ElevationScroll(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
      target: window ? window() : undefined
    });

    return React.cloneElement(children, {
      elevation: trigger ? 4 : 0
    });
  }

  ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar
          color="inherit"
          sx={{
            backgroundColor: "rgba(250, 250, 250, 0.8)",
            backdropFilter: "saturate(200%) blur(10px)"
          }}
        >
          <Toolbar>
            <Container maxWidth="sm">
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <img src={finFeedLogo} width={48} alt="FinFeed logo" />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
                    <InputLabel variant="standard" htmlFor="demo-select-small">
                      Select News Source
                    </InputLabel>
                    <NativeSelect
                      onChange={fetchNewsOnClick}
                      inputProps={{
                        name: "Select News Source",
                        id: "demo-select-small"
                      }}
                      value={feed}
                    >
                      <option value="cnbc">CNBC</option>
                      <option value="wsj">WSJ</option>
                      <option value="polygon">Polygon</option>
                    </NativeSelect>
                  </FormControl>

                  <RefreshIcon
                    onClick={() => {
                      if (feed !== null) GetNewsReports(feed);
                    }}
                    sx={{ color: "dodgerblue" }}
                  />
                </Typography>
              </Stack>
            </Container>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Container maxWidth="sm" sx={{ paddingTop: "32px" }}>
        <React.Fragment>
          {!loading && items?.length === 0 ? (
            <div>{GetNewsReports(feed)}</div>
          ) : loading ? (
            [1, 2, 3, 4, 5, 6, 7].map((e, i) => {
              return (
                <Card
                  key={i}
                  variant="outlined"
                  orientation="vertical"
                  sx={{
                    mb: 3,
                    gap: 2,
                    "&:hover": {
                      boxShadow: "md",
                      borderColor: "neutral.outlinedHoverBorder"
                    }
                  }}
                >
                  <React.Fragment key={i}>
                    <Skeleton
                      animation="wave"
                      height={30}
                      style={{ marginBottom: 6 }}
                    />
                    <Skeleton
                      animation="wave"
                      height={30}
                      style={{ marginBottom: 12 }}
                      width="80%"
                    />
                    <Skeleton animation="wave" height={10} width="40%" />
                  </React.Fragment>
                  <CardOverflow
                    variant="soft"
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      py: 1.5,
                      px: "var(--Card-padding)",
                      bgcolor: "background.level1"
                    }}
                  >
                    <Skeleton animation="wave" height={20} width="40%" />
                  </CardOverflow>
                </Card>
              );
            })
          ) : (
            <div>
              {sortDataByDate(items, "desc").map((item, i) => {
                return (
                  <div key={i}>
                    <NewsItemCard data={item} />
                  </div>
                );
              })}
            </div>
          )}
        </React.Fragment>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;
