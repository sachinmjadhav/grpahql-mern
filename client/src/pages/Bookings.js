import React, {useState, useEffect, useContext} from "react";
import AuthContext from "../context/auth-context";
import BookingList from "../components/Bookings/BookingList/BookingList";
import Spinner from "../components/Spinner/Spinner";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControl from "../components/Bookings/BookingsControls/BookingsControls";

const BookingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState("list");

  const {token} = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    let requestBody = {
      query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
              }
            }
          }
        `
    };

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const deleteBookingHandler = bookingId => {
    setIsLoading(true);
    let requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
    };

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        setBookings(prev => {
          return prev.filter(booking => booking._id !== bookingId);
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const outputTypeHandler = outputType => {
    if (outputType == "list") {
      setOutputType("list");
    } else {
      setOutputType("chart");
    }
  };

  let content = <Spinner />;
  if (!isLoading) {
    content = (
      <React.Fragment>
        <BookingsControl activeOutputType={outputType} outputTypeHandler={outputTypeHandler} />
        <div>
          {outputType === "list" ? (
            <BookingList
              bookings={bookings}
              onDelete={deleteBookingHandler}
            />
          ) : (
            <BookingsChart bookings={bookings} />
          )}
        </div>
      </React.Fragment>
    );
  }

  return <React.Fragment>{content}</React.Fragment>;
};

export default BookingsPage;
