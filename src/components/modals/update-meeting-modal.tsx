import { useState } from "react";
import { Meeting, updateMeeting } from "../requests/meeting-requests";

type UpdateMeetingModalProps = {
  show: boolean;
  onClose: () => void;
  meeting: Meeting;
  onUpdateMeeting: (updatedMeeting: Meeting) => void;
};

export function formatDatetimeLocal(unixTime: number) {
    const date = new Date(unixTime * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function parseDatetimeLocal(datetime: string) {
    const date = new Date(datetime);
    return Math.floor(date.getTime() / 1000);
};

export function UpdateMeetingModal({ show, onClose, meeting, onUpdateMeeting }: UpdateMeetingModalProps) {
  const [title, setTitle] = useState(meeting.title);
  const [address, setAddress] = useState(meeting.address);
  const [time, setTime] = useState(meeting.time);
  const [summary, setSummary] = useState(meeting.summary);

  const handleSubmit = async () => {
    const updatedMeeting = await updateMeeting(meeting.meeting_id, {
        meeting_id: meeting.meeting_id,
         title, 
         address, 
         time, 
         summary 
        });
    onUpdateMeeting(updatedMeeting);
  };

  const handleTimeChange = (value: string) => {
    setTime(parseDatetimeLocal(value));
  };

  if (!show) return null;

  return (
    <div className="modal-background">
      <div className="modal">
      <h2>Update Meeting</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
      <label htmlFor="time">Time:</label>
        <input type="datetime" id="time" name="time" value={formatDatetimeLocal(meeting.time)}
            onChange={(e) => handleTimeChange(e.target.value)}/>
      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Description" />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
