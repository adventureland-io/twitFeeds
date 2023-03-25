import * as React from "react";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import Moment from "react-moment";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";

import MoodIcon from "@mui/icons-material/Mood";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";

function Sentiment({ pos, neg }) {
  let sentiment;
  if (pos > 0 || neg > 0) {
    sentiment = (
      <React.Fragment>
        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: "none" }}
          startDecorator={
            <MoodIcon
              fontSize="small"
              sx={{ color: pos === 0 ? "lightgrey" : "green" }}
            />
          }
          disabled={pos === 0}
        >
          <Typography
            level="body3"
            sx={{ fontWeight: "md", color: "text.secondary" }}
          >
            &nbsp;Positive&nbsp;
            {pos}%
          </Typography>
        </Chip>

        <Divider orientation="vertical" />

        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: "none" }}
          startDecorator={
            <MoodBadIcon
              fontSize="small"
              sx={{ color: neg === 0 ? "lightgrey" : "crimson" }}
            />
          }
          disabled={neg === 0}
        >
          <Typography
            level="body3"
            sx={{ fontWeight: "md", color: "text.secondary" }}
          >
            &nbsp;Negative&nbsp;{neg}%
          </Typography>
        </Chip>
      </React.Fragment>
    );
  } else {
    sentiment = (
      <Chip
        variant="outlined"
        color="primary"
        size="sm"
        sx={{ pointerEvents: "none" }}
        startDecorator={
          <SentimentNeutralOutlinedIcon
            fontSize="small"
            sx={{ color: "text.primary" }}
          />
        }
      >
        <Typography
          level="body3"
          sx={{ fontWeight: "md", color: "text.primary" }}
        >
          &nbsp;Neutral&nbsp;
        </Typography>
      </Chip>
    );
  }

  return <React.Fragment>{sentiment}</React.Fragment>;
}

const NewsItemCard = React.memo(function NewsItemCard(data) {
  return (
    <Card
      variant="outlined"
      orientation="vertical"
      sx={{
        gap: 2,
        mb: 3,
        "&:hover": {
          boxShadow: "md",
          borderColor: "neutral.outlinedHoverBorder"
        }
      }}
    >
      <div>
        <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
          {data.data?.text}
        </Typography>
        <Typography
          fontSize="sm"
          aria-describedby="card-description"
          mb={1}
        ></Typography>
        <Typography fontSize="sm" aria-describedby="card-description" mb={1}>
          <Link
            overlay
            underline="none"
            href="#interactive-card"
            sx={{ color: "text.tertiary" }}
          >
            <Moment format="MMM Do YYYY h:mm a" date={data.data?.date} />
          </Link>
        </Typography>
      </div>
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
        <Sentiment
          pos={parseInt(data.data.pos, 10)}
          neg={parseInt(data.data.neg, 10)}
        />
      </CardOverflow>
    </Card>
  );
});

export default NewsItemCard;
