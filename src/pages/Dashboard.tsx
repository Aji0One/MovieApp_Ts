import React, { useState } from 'react';
import Movie from './Movie';
import Notify from '../components/Componets/Notify';
import Pagination from '@mui/material/Pagination';

import "../styles/Dashboard.css";
import { TextField, Button } from '@mui/material';



const Dashboard = () => {
    const [val, setVal] = useState<string>("");
    const [state, setState] = useState<boolean>(false);
    const [notify, setNotify] = useState<boolean>(false);
    const [details, setDetails] = useState<any>();
    const [show, setShow] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState<number>();

    const handleChange = async (event: React.ChangeEvent<unknown>, value: number) => {


        try {
            setPage(value);
            const myres = await fetch(`https://www.omdbapi.com/?s=${val}&apikey=17e7e658&page=${value}`);
            const data = await myres.json();
            setDetails(data);



        } catch (err: any) {
            console.log(err.message);
        }
    };




    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setDetails("");
        setState(true);
        setPage(1);
        try {

            const res = await fetch(`https://www.omdbapi.com/?s=${val}&apikey=17e7e658`);
            const mydata = await res.json();

            if (mydata?.Response === "True") {
                setDetails(mydata);
                setTotalPage(Math.floor(mydata.totalResults / 10))

            } else {
                setNotify(true);
                setState(false);
            }

        } catch (err: any) {
            console.log(err.message);
            setNotify(true);
            setState(false);
        }


    }

    return (
        <section className='mydash'>
            {!show && <h3 className='heading'><b>Movies Info</b></h3>}
            {!show && <div className='myinput' data-testid="input">

                <form onSubmit={(e) => handleSubmit(e)} data-testid="form">
                    <TextField variant='outlined' label="Search by Name" className="inputF" onChange={(e) => { setVal(e.target.value) }} />
                    <Button variant='contained' type='submit' className='btn'>Submit</Button>
                </form>
            </div>}
            {notify && <Notify setNotify={setNotify} message="Enter Valid Name" data-testid="notify" />}
            {state && <div className='outerCont' data-testid="movie" > <Movie details={details} setShow={setShow} show={show} /></div>}
            {!show && state && details?.Response === "True" && <div className='Pagination' data-testid="pagination"> <Pagination count={totalPage} page={page} onChange={handleChange} color='primary' data-testid="pages" /></div>}
        </section>

    )
}

export default Dashboard;
