"use client";

import { CardActionArea, CardMedia, Typography, CardContent, styled, Card, Link,  } from "@mui/material";
import { IWithClassName } from "@/app/theme/default";
import React from "react";

interface IMovieTab extends IWithClassName{
  title?: string;
  year?: number;
  url: string;
  id: string;
}

const MovieTab = ({className, title, year, url, id}: IMovieTab) => (
    <Card className={className}>
        <CardActionArea component={Link} href={`movie/${id.replaceAll("/", "%2F")}?year=${year}&title=${title}&url=${encodeURI(url)}`}>
        <CardMedia
          component="img"
          image={url}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title ?? "--"}
          </Typography>
          <Typography variant="body2">
            {year ?? "--"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
);

export default styled(MovieTab)(({theme}) => ({
  width: 250,
  margin: theme.spacing(1, 0),
  ".MuiCardMedia-root": {
    height: 300
  },
  [theme?.breakpoints.down("md") ?? ""]: {
    width: "49%",
    minWidth: 100,
  },
}))
