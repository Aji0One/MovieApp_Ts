import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Movie from "./Movie";

const showSet = jest.fn();

const detail = {
    Search: [
        { Title: 'Movie 1', imdbID: '1' },
        { Title: 'Movie 2', imdbID: '2' },
    ]
}

const mockFetch = (data: any, status = 200) => {
    return jest.fn().mockImplementation(() =>
        Promise.resolve({
            status,
            json: () => Promise.resolve(data),
        })
    );
};

describe("Movie", () => {

    test('should handle errors in handlePlot function', async () => {
        const details = {
            Search: [
                { imdbID: 'id1', Title: 'Movie 1', Type: 'movie', Year: '2021', Poster: 'N/A' },
            ],
        };


        const mockFetch = jest.spyOn(global, 'fetch');
        mockFetch.mockRejectedValueOnce(new Error('API error'));

        render(<Movie details={details} setShow={showSet} show={true} />);


        const contElement = screen.getByTestId('cont-id1');

        act(() => fireEvent.click(contElement));

        await waitFor(() => {

            expect(showSet).toHaveBeenCalledTimes(1);

        });
    });

    test('should fetch movie plot data and display it correctly', async () => {
        const movieDetails = {
            Search: [
                { imdbID: 'id1', Title: 'Movie 1', Type: 'movie', Year: '2021', Poster: 'poster1.jpg' },
            ],
        };

        const moviePlotData = {
            Title: 'Movie 1',
            Year: '2021',
            Poster: 'poster1.jpg',
            Genre: 'Action',
            Language: 'English',
            Plot: 'Test plot for Movie 1',
        };

        global.fetch = mockFetch(moviePlotData)

        render(<Movie details={movieDetails} setShow={showSet} show={true} />);


        const movieElement = screen.getByTestId('cont-id1');
        act(() => fireEvent.click(movieElement));

        await waitFor(() => {
            expect(screen.getByText('Movie 1')).toBeInTheDocument();
            expect(screen.getByText('2021')).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
            expect(screen.getByText('English')).toBeInTheDocument();
            expect(screen.getByText('Test plot for Movie 1')).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledWith('https://www.omdbapi.com/?i=id1&apikey=17e7e658');
    });

    test("Checking the function inside the singMovie component", async () => {
        const movieDetails = {
            Search: [
                { imdbID: 'id1', Title: 'Movie 1', Type: 'movie', Year: '2021', Poster: 'poster1.jpg' },
            ],
        };

        const moviePlotData = {
            Title: 'Movie 1',
            Year: '2021',
            Poster: 'N/A',
            Genre: 'Action',
            Language: 'English',
            Plot: 'Test plot for Movie 1',
        };

        const plothandle = jest.fn();
        const showhandle = jest.fn();
        global.fetch = mockFetch(moviePlotData)

        render(<Movie details={movieDetails} setShow={showSet} show={true} />);
        const movieElement = screen.getByTestId('cont-id1');
        act(() => fireEvent.click(movieElement));
        screen.debug()

        const cElement = await screen.findByTestId("cancel");
        act(() => {
            fireEvent.click(cElement, showhandle());
            fireEvent.click(cElement, plothandle());
        })

        expect(showhandle).toHaveBeenCalledTimes(1);
        expect(plothandle).toHaveBeenCalledTimes(1);
    })
})