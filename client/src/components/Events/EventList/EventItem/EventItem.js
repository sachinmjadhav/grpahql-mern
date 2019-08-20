import React from "react";
import "./EventItem.css";

const EventItem = props => (
  <li key={props.eventId} className="events__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>
        Rs.{props.price} - {new Date(props.date).toLocaleDateString()}
      </h2>
    </div>
    <div style={{ textAlign: 'center' }}>
      {props.userId === props.creatorId ? (
        <>
        {/* <p>You are the owner of this event</p> */}
        <button className="btn btn-danger" onClick={() => props.onDeleteEvent(props.eventId)}>Delete Event</button>
        </>
      ) : (
        <button
          className="btn"
          onClick={() => props.onDetail(props.eventId)}
        >
          View Details
        </button>
      )}
    </div>
  </li>
);

export default EventItem;
