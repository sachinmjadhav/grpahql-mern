import React, {useState, useRef, useContext, useEffect} from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import fetcher from '../helpers/fetcher';
import "./Events.css";

const EventsPage = () => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const titleRef = useRef("");
  const priceRef = useRef("");
  const dateRef = useRef("");
  const descriptionRef = useRef("");
  const isActive = useRef(true);

  useEffect(() => {
    fetchEvents();
    return () => {
      isActive.current = false;
    };
  }, []);

  const {token, userId} = useContext(AuthContext);

  const onModalCancel = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const onModalConfirm = () => {
    setCreating(false);
    const title = titleRef.current.value;
    const price = +priceRef.current.value;
    const date = dateRef.current.value;
    const description = descriptionRef.current.value;

    if (
      title.trim().length === 0 ||
      price.length <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    let requestBody = {
      query: `
        mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) { createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
            _id
            title
            description
            date
            price
          }
        }
      `,
      variables: {
        title,
        description,
        price,
        date
      }
    };

    fetcher(requestBody, token.token)
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        setEvents(events => {
          const updatedEvents = [
            ...events,
            {
              _id: resData.data.createEvent._id,
              title: resData.data.createEvent.title,
              description: resData.data.createEvent.description,
              date: resData.data.createEvent.date,
              price: resData.data.createEvent.price,
              creator: {
                _id: userId.userId
              }
            }
          ];
          return updatedEvents;
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const fetchEvents = () => {
    setIsLoading(true);
    let requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
            }
          }
        }
      `
    };

    fetcher(requestBody)
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        const eventss = resData.data.events;
        if (isActive.current) {
          setEvents(eventss);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isActive.current) {
          console.log(err);
          setIsLoading(false);
        }
      });
  };

  const showDetailHandler = eventId => {
    setSelectedEvent(prev => {
      const selectedEvent = events.find(e => e._id === eventId);
      return selectedEvent;
    });
  };

  const bookEventHandler = () => {
    if (!token) {
      setSelectedEvent(null);
      return;
    }
    let requestBody = {
      query: `
        mutation BookEvent($id: ID!){
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: selectedEvent._id
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
        if (res.status === 500) {
          throw new Error("Already Booked");
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log(res);
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        setSelectedEvent(null);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const onDeleteEvent = eventId => {
    let requestBody = {
      query: `
        mutation DeleteEvent($eventId: ID!) {
          deleteEvent(eventId: $eventId) {
            _id
            title
          }HERE!!!
        }
      `,
      variables: {
        eventId
      }
    }

    fetcher(requestBody, token.token)
      .then(res => res.json())
      .then(data => fetchEvents())
      .catch(err => {
        throw new Error(err);
      });
  }

  return (
    <React.Fragment>
      {creating && (
        <React.Fragment>
          <Backdrop />
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={onModalCancel}
            onConfirm={onModalConfirm}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" placeholder="Title" ref={titleRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" placeholder="Price" ref={priceRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  ref={dateRef}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Description"
                  rows="4"
                  ref={descriptionRef}
                />
              </div>
            </form>
          </Modal>
        </React.Fragment>
      )}
      {selectedEvent && (
        <React.Fragment>
          <Backdrop />
          <Modal
            title={selectedEvent.title}
            canCancel={token}
            canConfirm
            onCancel={onModalCancel}
            onConfirm={bookEventHandler}
            confirmText={token ? "Book" : "Ok"}
          >
            <h1>{selectedEvent.title}</h1>
            <h2>
              ${selectedEvent.price} -{" "}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{selectedEvent.description}</p>
          </Modal>
        </React.Fragment>
      )}
      {token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={userId && userId.userId}
          onViewDetail={showDetailHandler}
          onDeleteEvent={onDeleteEvent}
        />
      )}
    </React.Fragment>
  );
};

export default EventsPage;
