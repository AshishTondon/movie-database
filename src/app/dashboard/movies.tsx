"use client";

import {
  Button,
  Container,
  Typography,
  Box,
  styled,
  IconButton,
} from "@mui/material";
import { IWithClassName } from "@/app/theme/default";
import Tab from "./movie-tab";
import React, { useCallback, useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import CircularProgress from "@mui/material/CircularProgress";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { signOut } from "firebase/auth";
import { auth } from "@/app/common/firebase-config";
import { redirect } from "next/navigation";
import { request } from "@/app/common/api-request";
import { IMovie, IMovieList } from "@/app/interface/movie.dto";

const EmptyContainer = ({ className }: IWithClassName) => (
  <Box className={className}>
    <Typography variant="h3">Your movie list is empty</Typography>
    <Box className="button-cont">
      <Button>Add a new movie</Button>
    </Box>
  </Box>
);

const DashboardHeader = ({ className }: IWithClassName) => {
  const handleSignOut = useCallback(async () => {
    const isSignOut = await signOut(auth)
      .then(() => true)
      .catch((error) => {
        console.error("Error logging out:", error.message);

        return false;
      });

    if (isSignOut) {
      redirect("/login");
    }
  }, [auth]);
  return (
    <Box className={className}>
      <Box component="span" className="title-cont">
        <Typography variant="h4">My movies</Typography>
        <IconButton href="/movie/create">
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      <IconButton onClick={handleSignOut}>
        <LogoutIcon />
      </IconButton>
    </Box>
  );
};

const Movies = ({ className }: IWithClassName) => {
  const [movies, setMovies] = useState<Array<IMovieList>>();
  const [nextPageId, setNextPageId] = useState<string>();
  const [isLoading, setLoader] = useState<boolean>(false);

  const loadMore = () => {
    setLoader(true);

    request<IMovie>({
      url: `/movie${nextPageId ? `?page=${nextPageId}` : ""}`,
      method: "GET",
    })
      .then((movies) => {
        if (movies) {
          setMovies((movieArr) =>
            [...(movieArr ?? []), ...movies.list].filter(
              (value, index, self) =>
                index === self.findIndex(({ id }) => id === value.id),
            ),
          );

          setNextPageId(movies.nextPage);
        }

        setLoader(false);
      })
      .catch((err) => {
        console.error("Err", err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <Container className={className}>
      {!isLoading && movies && movies.length === 0 ? (
        <EmptyContainer />
      ) : (
        <>
          <DashboardHeader className="dashbaord-header" />
          <Box className="tab-cont">
            {movies?.map(({ id, title, url, year }) => (
              <Tab key={id} title={title} url={url} year={year} id={id} />
            ))}
          </Box>
          <Box className="tab-cont paging-cont">
            {isLoading && <CircularProgress className="process-bar" />}
            {!isLoading && nextPageId && (
              <Button
                className="process-bar"
                variant="outlined"
                onClick={loadMore}
              >
                Load More
              </Button>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default styled(Movies)(({ theme }) => ({
  width: "90%",
  padding: theme.spacing(3, 0),
  ".tab-cont": {
    width: "100%",
    textAlign: "center",
    alignItems: "center",
    verticalAlign: "center",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  [theme?.breakpoints.down("md") ?? ""]: {
    width: "100%",
  },
  ".button-cont": {
    paddingTop: 30,
  },
  ".dashbaord-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: theme.spacing(1, 0),
    ".title-cont": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
  },
  ".process-bar": {
    margin: "auto",
  },
  ".paging-cont": {
    margin: theme.spacing(2, 0),
  },
}));