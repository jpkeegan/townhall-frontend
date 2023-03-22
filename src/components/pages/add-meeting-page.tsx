import React, { useEffect, useReducer, useState } from 'react';
import { User } from '../requests/user-requests';
import { Complaint, updateComplaint } from '../requests/complaint-requests';
import { Meeting, addMeeting } from '../requests/meeting-requests';
import { getAllComplaints } from '../requests/complaint-requests';
import { useNavigate } from 'react-router-dom';
import { addMeetingReducer } from '../reducers/add-meeting-reducer';
import "../styles/add-meeting-styles.css";

type AddMeetingPageProps = {
  user: User;
};


export function AddMeetingPage({ user }: AddMeetingPageProps) {
    const initialState = {
      title: '',
      address: '',
      time: '',
      summary: '',
      selectedComplaints: [] as number[],
      complaints: [] as Complaint[],
    };
    const [state, dispatch] = useReducer(addMeetingReducer, initialState);
    const { title, address, time, summary, selectedComplaints, complaints } = state;
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchComplaints = async () => {
        const fetchedComplaints = await getAllComplaints();
        dispatch({ type: 'SET_COMPLAINTS', payload: fetchedComplaints });
      };
  
      fetchComplaints();
    }, []);
  
    function isFormValid(){
      if(!title || !address || !time || !summary) {
          alert("Please fill in all the fields");
          return;
      }
      return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }
    const newMeeting: Omit<Meeting, "meeting_id"> = {
      title,
      address,
      time: new Date(time).getTime() / 1000,
      summary,
    };
  
    const createdMeeting = await addMeeting(newMeeting);

    console.log("Created meeting:", createdMeeting);
  
    for (const complaintId of Array.from(selectedComplaints)) {
      const complaintToUpdate = complaints.find((complaint) => complaint.complaint_id === complaintId);
      if (complaintToUpdate) {
        const updatedComplaint: Complaint = {
          ...complaintToUpdate,
          meeting_id: createdMeeting.meeting_id,
        };
        console.log("Updating complaint:", updatedComplaint);
        await updateComplaint(complaintId, updatedComplaint);
      }
    }
    alert("Meeting Created");
    navigate("/");
  };

  return (
    <div className='meeting-container'>
        <h2>Add Meeting</h2>
        <input value={title} placeholder="Title"
            onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}/>
        <input value={address} placeholder="Address"
            onChange={(e) => dispatch({ type: 'SET_ADDRESS', payload: e.target.value })}/>
        <label htmlFor="time">Date and Time</label>
        <input type="datetime-local" id="time" name="time" value={time}
            onChange={(e) => dispatch({type: 'SET_TIME', payload: e.target.value})}/>
        <textarea value={summary} placeholder="Summary"
            onChange={(e) => dispatch({ type: 'SET_SUMMARY', payload: e.target.value })}/>

        <button onClick={handleSubmit}>Submit</button>

        <h4>Which Complaints will this address?</h4>
        <ul>
        {complaints.filter((complaint) => complaint.meeting_id === null).map((complaint) => (
        <li key={complaint.complaint_id}>
          <input type="checkbox" id={`complaint-${complaint.complaint_id}`} checked={selectedComplaints.includes(complaint.complaint_id)}
            onChange={() => dispatch({ type: 'TOGGLE_COMPLAINT', payload: complaint })}/>
          <label htmlFor={`complaint-${complaint.complaint_id}`}>{complaint.title} - {complaint.status}</label>
        </li>
        ))}
        </ul>
    </div>
  );
}

