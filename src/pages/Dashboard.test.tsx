import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

import Dashboard from "./Dashboard";


const mockFetch = (data: any, status = 200) => {
    return jest.fn().mockImplementation(() =>
        Promise.resolve({
            status,
            json: () => Promise.resolve(data),
        })
    );
};

describe("Dashboard", () => {
    test("render dashboard", () => {
        render(<Dashboard />);
        const title = screen.getByRole("heading", { level: 3 });
        expect(title).toBeInTheDocument();

        const input = screen.getByRole("textbox");
        expect(input).toBeInTheDocument();
    })



    test('getting movie details when a valid name is entered', async () => {
        const mockResponse = {
            Response: 'True',

        };


        global.fetch = mockFetch(mockResponse);

        render(<Dashboard />);
        const searchInput = screen.getByLabelText(/search by name/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /submit/i });


        fireEvent.change(searchInput, { target: { value: 'iron' } });
        await act(() => fireEvent.click(submitButton));


        await waitFor(async () => {
            const movieDetails = await screen.findByTestId('movie');
            expect(movieDetails).toBeInTheDocument();
        });

        await waitFor(async () => {
            const pagination = await screen.findByTestId('pagination');
            expect(pagination).toBeInTheDocument();
        });
    });


    test('pagination onclick different page', async () => {
        const mockResponse = {
            Response: 'True',
            totalResults: 20,
        };


        global.fetch = mockFetch(mockResponse);

        render(<Dashboard />);
        const searchInput = screen.getByLabelText(/search by name/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /submit/i });


        fireEvent.change(searchInput, { target: { value: 'iron' } });
        await act(() => fireEvent.click(submitButton));

        expect(screen.getByTestId("pagination")).toBeInTheDocument();

        const pagebtn = screen.getByTestId("pages");

        fireEvent.change(pagebtn);
        // screen.debug();
        await waitFor(async () => {
            const movieDetails = await screen.findByTestId('movie');
            expect(movieDetails).toBeInTheDocument();
        });

    });

    it("handle else statement in handleSubmit", async () => {
        const mockResponse = {
            Response: 'False',

        };


        global.fetch = mockFetch(mockResponse);

        const notifyhandle = jest.fn();
        render(<Dashboard />);
        const searchInput = screen.getByLabelText(/search by name/i) as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /submit/i });


        fireEvent.change(searchInput, { target: { value: 'iron' } });
        await act(() => fireEvent.click(submitButton, notifyhandle));


        await waitFor(() => {
            const movieDetails = screen.queryByTestId('movie');
            expect(movieDetails).not.toBeInTheDocument();
        });


    })

    it('handles API error in handleSubmit', async () => {

        const mockFetch = jest.spyOn(global, 'fetch');
        mockFetch.mockRejectedValueOnce(new Error('API error'));

        render(<Dashboard />);
        const searchInput = screen.getByLabelText(/search by name/i) as HTMLInputElement;


        act(() => {
            fireEvent.change(searchInput, { target: { value: 'Batman' } });
        });


        act(() => {
            fireEvent.click(screen.getByText('Submit'));
        });

        await act(() => new Promise((resolve) => setTimeout(resolve)));

        expect(screen.queryByTestId('movie')).not.toBeInTheDocument();

        mockFetch.mockRestore();
    });


})