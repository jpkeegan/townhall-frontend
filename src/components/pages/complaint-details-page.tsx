import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Complaint, getComplaintById, updateComplaint } from "../requests/complaint-requests";
import { User } from "../requests/user-requests";
import "../styles/complaint-details-styles.css"

type ComplaintDetailsPageProps = {
  user: User;
};

export function ComplaintDetailsPage({ user }: ComplaintDetailsPageProps) {
  const { complaint_id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaint = async () => {
      const fetchedComplaint = await getComplaintById(Number(complaint_id));
      setComplaint(fetchedComplaint);
    };
    fetchComplaint();
  }, [complaint_id]);

  const updateComplaintStatus = async (status: string) => {
    if (complaint) {
      const updatedComplaint = await updateComplaint(complaint.complaint_id, { ...complaint, status });
      setComplaint(updatedComplaint);
    }
    alert("Complaint Updated");
    navigate("/");
  };

  if (!complaint) return <div>Loading...</div>;

  return (
    <div className="complaint-container">
      <h1>{complaint.title}</h1>
      <p>{complaint.description}</p>
      <button onClick={() => updateComplaintStatus("High Priority")}>High Priority</button>
      <button onClick={() => updateComplaintStatus("Low Priority")}>Low Priority</button>
      <button onClick={() => updateComplaintStatus("Ignored")}>Ignored</button>
    </div>
  );
}
