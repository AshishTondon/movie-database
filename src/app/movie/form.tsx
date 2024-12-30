"use client";

import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  styled,
  IconButton,
  FormControl,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { IWithClassName } from "@/app/theme/default";
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import movieSchema from "@/app/common/validation/movie";
import { useDropzone } from "react-dropzone";
import { request } from "@/app/common/api-request";
import { IMovieAdd, IMovieEditBody } from "@/app/interface/movie.dto";
import { redirect } from "next/navigation";

interface IProps extends IWithClassName {
  header: string;
  title?: string;
  year?: number;
  id?: string;
  url?: string;
}

enum Label {
  title = "title",
  year = "year",
}

interface IConfimationDialog {
  open: boolean;
  deleteHandler: () => void;
  handleClose: () => void;
}

const ConfimationDialog = ({
  open,
  deleteHandler,
  handleClose,
}: IConfimationDialog) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description" component={Typography}>
          Please confirm if you want to delete the poster?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={deleteHandler} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MovieForm = ({ className, header, title, year, id, url }: IProps) => {
  const [movieTitle, setmovieTitle] = useState<string>();
  const [movieYear, setMovieYear] = useState<number>();
  const [moviePoster, setMoviePoster] = useState<File | string>();
  const [isLoading, setLoader] = useState<boolean>(false);
  const [isOpenDialog, setDialog] = useState<boolean>(false);

  const [error, setError] = useState<{
    title?: null | string;
    year?: null | string;
    poster?: null | string;
  }>({
    title: null,
    year: null,
    poster: null,
  });

  useEffect(() => {
    console.log("id", id);
    if (id) {
      setmovieTitle(title);
      setMovieYear(year);
      setMoviePoster(url);
    }
  }, [title, year, url, id]);

  const display = (isDragActive: boolean) => {
    console.log("moviePoster", moviePoster);
    if (moviePoster) {
      return (
        <img
          height="200"
          src={
            typeof moviePoster === "string"
              ? moviePoster
              : URL.createObjectURL(moviePoster)
          }
        />
      );
    } else {
      if (isDragActive) {
        return <Typography>Drop Here!</Typography>;
      } else {
        return (
          <>
            <IconButton>
              <DownloadIcon />
            </IconButton>
            <Typography>Drop an image here</Typography>
          </>
        );
      }
    }
  };

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    // Do something with the files
    setMoviePoster(acceptedFiles[0]);
    console.log("acceptedFiles", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !!id,
  });

  const onChangeText =
    (label: Label) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      switch (label) {
        case Label.title:
          setmovieTitle(target.value);
          break;
        case Label.year:
          setMovieYear(Number(target.value));
          break;
      }
    };

  const deleteHandler = async () => {
    handleClose();
    setLoader(true);

    const isRedirect = await request<IMovieAdd>({
      url: `/movie?id=${id}`,
      method: "DELETE",
    })
      .then(() => true)
      .catch((err) => {
        console.log("error", err);

        return false;
      })
      .finally(() => {
        setLoader(false);
      });

    if (isRedirect) {
      redirect("/dashboard");
    }
  };

  const handleClose = () => {
    setDialog(false);
  };

  const validate = async () => {
    const { error } = movieSchema.validate({
      title: movieTitle,
      year: movieYear,
    });

    if (error) {
      const { context, message } = error.details[0];

      console.log("error", error);

      setError({
        title: null,
        year: null,
        poster: null,
        [context?.label ?? "title"]: message,
      });
    } else if (!moviePoster) {
      setError({ title: null, year: null, poster: "Please Attach a poster" });
    } else if (!id) {
      // Create movie poster code
      const form = new FormData();

      form.append("file", moviePoster);
      form.append("title", movieTitle ?? "");
      form.append("year", (movieYear ?? 0).toString());

      setLoader(true);

      const isRedirect = await request<IMovieAdd, FormData>({
        url: "/movie",
        method: "POST",
        body: form,
        stringify: false,
      })
        .then(() => true)
        .catch((err) => {
          console.log("error", err);

          return false;
        })
        .finally(() => {
          setLoader(false);
        });

      if (isRedirect) {
        redirect("/dashboard");
      }
    } else {
      const isRedirect = await request<IMovieAdd, IMovieEditBody>({
        url: "/movie",
        method: "PUT",
        body: {
          title: movieTitle ?? "",
          year: movieYear ?? 0,
          id,
        },
      })
        .then(() => true)
        .catch((err) => {
          console.log("error", err);

          return false;
        })
        .finally(() => {
          setLoader(false);
        });

      if (isRedirect) {
        redirect("/dashboard");
      }
    }
  };

  return (
    <Container className={className}>
      <Box className="header" component={Typography} variant="h4">
        {header}
      </Box>
      <Box className="file-upload-cont file-upload-desktop" {...getRootProps()}>
        <input {...getInputProps()} className="file-input" />
        {display(isDragActive)}
      </Box>
      <Box className="detail-form-cont">
        <FormControl>
          <TextField
            placeholder="Title"
            value={movieTitle ?? ""}
            helperText={error.title}
            error={!!error.title}
            onChange={onChangeText(Label.title)}
          />
        </FormControl>

        <FormControl className="publish-year">
          <TextField
            placeholder="Publishing Year"
            type="number"
            value={movieYear ?? ""}
            helperText={error.year}
            error={!!error.year}
            onChange={onChangeText(Label.year)}
          />
        </FormControl>

        <FormControl>
          <Box
            className="file-upload-cont file-upload-cont-mobile"
            {...getRootProps()}
          >
            <input {...getInputProps()} className="file-input" />
            {display(isDragActive)}
          </Box>
        </FormControl>

        <FormControl className="detail-button-cont">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Button variant="outlined" href="/dashboard">
                Cancel
              </Button>
              {id && (
                <Button
                  onClick={() => {
                    setDialog(true);
                  }}
                  color="error"
                >
                  Delete
                </Button>
              )}
              <Button onClick={validate}>Submit</Button>
            </>
          )}
        </FormControl>
      </Box>

      <ConfimationDialog
        open={isOpenDialog}
        deleteHandler={deleteHandler}
        handleClose={handleClose}
      />
    </Container>
  );
};

export default styled(MovieForm)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  ".header": {
    width: "100%",
    margin: theme.spacing(3, 0),
  },
  ".file-upload-cont": {
    border: "2px dashed",
    minWidth: 200,
    borderRadius: 10,
    backgroundColor: theme.palette.background.paper,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  ".detail-form-cont": {
    width: "49%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    maxWidth: 400,
  },
  ".detail-button-cont": {
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    gap: 10,
    margin: theme.spacing(4, 0),
  },
  ".file-upload-desktop": {
    width: "49%",
    height: 400,
  },
  ".file-upload-cont-mobile": {
    width: "100%",
    height: 200,
  },
  [theme?.breakpoints.up("md") ?? ""]: {
    ".file-upload-cont-mobile": {
      display: "none",
    },
    ".file-upload-desktop": {
      display: "flex",
    },
    ".publish-year": {
      maxWidth: 200,
    },
  },
  [theme?.breakpoints.down("md") ?? ""]: {
    ".file-upload-cont-mobile": {
      display: "flex",
    },
    ".file-upload-desktop": {
      display: "none",
    },
    ".detail-form-cont": {
      width: "100%",
    },
    ".detail-button-cont": {
      gridTemplateColumns: "auto",
    },
  },
}));
