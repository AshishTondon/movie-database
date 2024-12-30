export interface IMovieList {
    url: string;
    title: string;
    year: number;
    id: string;
}

export interface IMovieEditBody {
    title: string;
    year: number;
    id: string;
}

export interface IMovie {
    list: Array<IMovieList>;
    nextPage: string;
}

export interface IMovieAdd {
    url: string;
    public_id: string;
}