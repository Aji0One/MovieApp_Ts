
import "../styles/Movie.css";
import Loading from "../components/Componets/Loading";
import default_movie from "../assets/default-movie.png";
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface movieProps {
    details: any;
    setShow: (active: boolean) => void;
    show: boolean
}

const Movie = ({ details, setShow, show }: movieProps) => {
    const [plot, setPlot] = useState(false);
    const [read, setRead] = useState(false);
    const [movieplot, setMoviePlot] = useState<any>();



    const handlePlot = async (id: string) => {
        try {
            setShow(true);
            setRead(false);
            const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=17e7e658`);
            const data = await res.json();
            setMoviePlot(data);

        } catch (err: any) {
            console.log(err?.message);
            setPlot(false);
        }
    }
    useEffect(() => {
        if (movieplot) {
            setPlot(true);
        }
    }, [movieplot])



    const SingleMovie = () => {
        const value = parseInt((movieplot.imdbRating / 2).toFixed(1));
        return (
            (movieplot && movieplot?.Title) ?
                <div className="outerPage" data-testid="outerPage">
                    <CancelIcon className="close" onClick={() => { setPlot(false); setShow(false) }} data-testid="cancel" />
                    <div className="movieCont">

                        <div className="movieposterC">
                            <img src={movieplot?.Poster === "N/A" ? default_movie : movieplot?.Poster} alt={movieplot?.Title} className="movieposter" />
                        </div>
                        <div className="movieInfo">
                            <ul className="movielist">
                                <li className="movietitle">{movieplot.Title}</li>
                                <li className="movieI"><span className="movieY">{movieplot.Year}</span><span className="movieT">{movieplot.Runtime}</span></li>
                                <li className="movieR">
                                    <Box
                                        sx={{
                                            width: 200,
                                            display: 'flex',
                                            alignItems: 'left',
                                        }}
                                    >
                                        <Rating
                                            name="text-feedback"
                                            value={value}
                                            readOnly
                                            precision={0.5}
                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />

                                    </Box>
                                </li>
                                <li className="movieG">{movieplot.Genre.split(",").join("|")}</li>
                                <li className="movieL">{movieplot.Language}</li>
                                <li className="movieplot">
                                    {read ? movieplot?.Plot : movieplot?.Plot.substr(0, 130)}
                                    <p className="read" onClick={() => setRead(!read)}>
                                        {read ? "read less ..." : "read more ..."}
                                    </p>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
                : <Loading />
        )
    }



    return (
        <>
            {!plot ? details && details?.Search ? details.Search.map((ele: any) => (
                <div className='cont' key={ele.imdbID} id="cont" onClick={() => handlePlot(ele?.imdbID)} style={{ cursor: "pointer !important" }} data-testid={`cont-${ele.imdbID}`}>
                    <div className='imgcont'>
                        <img src={ele?.Poster === "N/A" ? default_movie : ele?.Poster} alt={ele?.Title} />
                    </div>
                    <ul className='myList'><li className="mName">{ele?.Title} </li>
                        <li className="type">{ele?.Type} </li>
                        <li>{ele?.Year}</li>
                    </ul>
                </div>
            )) : <Loading /> : <SingleMovie />}
        </>
    )
}

export default Movie;
