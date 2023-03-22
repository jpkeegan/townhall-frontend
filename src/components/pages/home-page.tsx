import { useEffect, useReducer } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { addComplaint, Complaint, deleteComplaint, getAllComplaints } from "../requests/complaint-requests";
import { getAllMeetings, Meeting } from "../requests/meeting-requests";
import { User } from "../requests/user-requests";
import { HomeReducer, initialState } from "../reducers/home-page-reducer";
import "../styles/home-page-styles.css";

type HomePageProps = {
    user: User;
    onUserLogout: () => void;
};

export function HomePage({ user, onUserLogout }: HomePageProps) {
    const [state, dispatch] = useReducer(HomeReducer, initialState);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        const fetchComplaintsandMeetings = async() => {
            const fetchedComplaints = await getAllComplaints();
            const fetchedMeetings = await getAllMeetings();
            dispatch({ type: 'setComplaintList', payload: fetchedComplaints });
            dispatch({ type: 'setMeetingList', payload: fetchedMeetings });
        };
        fetchComplaintsandMeetings();
    }, []);

    const handleAddComplaint = async () => {
        const newComplaint = await addComplaint({ 
            title: state.complaintForm.title,
            description: state.complaintForm.description, 
            status: "PENDING"
        });
        dispatch({ type: 'setComplaintList', payload: [...state.complaintList, newComplaint] });
        dispatch({ type: 'resetComplaintForm' });
        dispatch({ type: 'setShowComplaintModal', payload: false });
        queryClient.invalidateQueries("complaints");
    };

    const handleDeleteComplaint = async (complaint_id: number) => {
        const isSuccess = await deleteComplaint(complaint_id);
        if (isSuccess) {
            dispatch({ type: 'setComplaintList', payload: state.complaintList.filter(c => c.complaint_id !== complaint_id) });
            queryClient.invalidateQueries("complaints");
        } else {
            alert("Error: Could not delete complaint");
        }
    };

    const isSithLord = user.role === "Sith Lord";

    return (
        <div className="home-page-container">
            <div className="content-container">
                <div className="complaints-container">
                    <h1 className="box-title">Complaints</h1>
                    <ul className="box-list">{state.complaintList.map((complaint) => (
                        <li key={complaint.complaint_id} className="box-list-item" 
                            onClick={isSithLord ? () => navigate(`/complaint/${complaint.complaint_id}`) : undefined}>
                                {complaint.title} - {complaint.status}
                                {isSithLord && complaint.status === "Ignored" && (
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteComplaint(complaint.complaint_id);}}>x</button>)}
                        </li>
                        ))}
                    </ul>
                <button className="box-button" onClick={() => dispatch({ type: "setShowComplaintModal", payload: true })}>
                Add Complaint
                </button>
            </div>

            <div className="meetings-container">
                <h1 className="box-title">Meetings</h1>
                    <ul className="box-list">
                    {state.meetingList.map((meeting) => (
                        <li key={meeting.meeting_id} className="box-list-item"
                            onClick={() => navigate(`/meeting/${meeting.meeting_id}`)}>
                            {meeting.title} - {new Date(meeting.time * 1000).toLocaleString()}
                        </li>
                    ))}
                </ul>
                {isSithLord && (
                <button className="box-button" onClick={() => navigate("/add-meeting")}>
                    Add Meeting
                </button>
                )}
            </div>
          </div>
          {state.showComplaintModal && (
            <div className="modal-background">
              <div className="modal">
                <button onClick={() => dispatch({ type: 'setShowComplaintModal', payload: false })}>x</button>
                <h2 className="box-title">Add Complaint</h2>
                <input type="text" placeholder="Title" value={state.complaintForm.title}
                  onChange={(e) => dispatch({ type: "setComplaintFormTitle", payload: e.target.value })}/>
                <br />
                <textarea placeholder="Description" value={state.complaintForm.description}
                  onChange={(e) => dispatch({ type: "setComplaintFormDescription", payload: e.target.value })}/>
                <br />
                <button className="modal-button" onClick={handleAddComplaint}>
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      );
}
