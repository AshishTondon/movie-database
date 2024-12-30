import { NextRequest } from "next/server";
import upload from "@/app/controller/upload";
import getMovieList from "@/app/controller/movie-list";
import editMovie from "@/app/controller/update-meta";
import deleteImage from "@/app/controller/delete-movie";

/**
 * @swagger
 *
 * /api/movie:
 *   get:
 *     tags:
 *       - Movie APIs
 *     description: Returns list of movies
 *     parameters:
 *       - name: page
 *         in: path
 *         description: next page token. If not passed by default first page will we get fetched.
 *         schema:
 *              type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          list:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      url:
 *                                          type: string
 *                                      title:
 *                                          type: string
 *                                      year:
 *                                          type: string
 *                                      id:
 *                                          type: string
 *                          nextPage:
 *                              type: string
 */
export const GET = (request: NextRequest) => {
  const page = request.nextUrl.searchParams.get("page");

  return getMovieList(page);
};

/**
 * @swagger
 *
 * /api/movie:
 *   post:
 *     tags:
 *       - Movie APIs
 *     description: upload movie poster and details
 *     requestBody:
 *       required: true,
 *       content:
 *          multipart/form-data:
 *              schema:
 *                  type: object
 *                  properties:
 *                      file:
 *                          type: string
 *                          format: binary
 *                          description: Poster upload
 *                      title:
 *                          type: string
 *                      year:
 *                          type: number
 *                  required:
 *                      - file
 *                      - title
 *                      - year
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          public_id:
 *                              type: string
 *                          url:
 *                              type: string
 */
export const POST = (request: NextRequest) => upload(request);

/**
 * @swagger
 *
 * /api/movie:
 *   put:
 *     tags:
 *       - Movie APIs
 *     description: update movie poster detail
 *     requestBody:
 *       required: true,
 *       content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *                      title:
 *                          type: string
 *                      year:
 *                          type: number
 *                  required:
 *                      - id
 *                      - title
 *                      - year
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          public_id:
 *                              type: string
 *                          url:
 *                              type: string
 */
export const PUT = (request: NextRequest) => editMovie(request);

/**
 * @swagger
 *
 * /api/movie:
 *   delete:
 *     tags:
 *       - Movie APIs
 *     description: delete movie poster by id
 *     parameters:
 *          - name: id
 *            in: query
 *            required: true
 *            schema:
 *              type: string
 *     responses:
 *       200:
 *         content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          public_id:
 *                              type: string
 *                          url:
 *                              type: string
 */
export const DELETE = (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id") ?? "";

  return deleteImage(id);
};
