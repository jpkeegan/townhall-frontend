import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Meeting, getMeetingById, updateMeeting, deleteMeeting } from "../requests/meeting-requests";
import { User } from "../requests/user-requests";
import { UpdateMeetingModal } from "../modals/update-meeting-modal";
import { Complaint, deleteComplaint, getAllComplaints } from "../requests/complaint-requests";
import "../styles/meeting-details-styles.css";

type MeetingDetailsPageProps = {
  user: User;
};

export function MeetingDetailsPage({ user }: MeetingDetailsPageProps) {
  const { meeting_id } = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeeting = async () => {
      const fetchedMeeting = await getMeetingById(Number(meeting_id));
      const fetchedComplaints = await getAllComplaints();
      setMeeting(fetchedMeeting);
      setComplaints(fetchedComplaints);
    };
    fetchMeeting();
  }, [meeting_id]);

  const handleUpdateMeeting = async (updatedMeeting: Meeting) => {
    setMeeting(updatedMeeting);
    setShowUpdateModal(false);
  };

  const handleDeleteMeeting = async () => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      const complaintsToDelete = complaints.filter(complaint => complaint.meeting_id === Number(meeting_id));

      for (const complaint of complaintsToDelete) {
        await deleteComplaint(complaint.complaint_id);
      }
      
      await deleteMeeting(Number(meeting_id));
      alert("Meeting Deleted");
      navigate("/");
    }
  };

  if (!meeting) return <div>Loading...</div>;

  const formattedDate = new Date(meeting.time * 1000).toLocaleString();

  return (
    <div className="meeting-container">
      <h1>{meeting.title}</h1>
      <p>Address: {meeting.address}</p>
      <p>Time: {formattedDate}</p>
      <p>Description: {meeting.summary}</p>
      {user.role === "Sith Lord" && (
        <>
          <button onClick={() => setShowUpdateModal(true)}>Update Meeting</button>
          <button onClick={handleDeleteMeeting}>Delete Meeting</button>
        </>
      )}
      <h4>Complaints to Address</h4>
      <ul>
        {complaints.filter((complaint) => complaint.meeting_id === Number(meeting_id))
          .map((complaint) => (<li key={complaint.complaint_id}>{complaint.title}</li>
        ))}
      </ul>
      <UpdateMeetingModal show={showUpdateModal} onClose={() => setShowUpdateModal(false)} meeting={meeting} onUpdateMeeting={handleUpdateMeeting} />
    </div>
  );
}
