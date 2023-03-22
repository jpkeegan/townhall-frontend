import { addComplaint, Complaint, deleteComplaint, getAllComplaints, getComplaintById, getComplaintsByMeetingId, getComplaintsByStatus, updateComplaint } from "../requests/complaint-requests"
import { addMeeting, deleteMeeting, Meeting } from "../requests/meeting-requests";


describe('Complaint API Requests', () => {
    let testComplaint: Complaint;
    let testMeeting: Meeting;

    beforeAll(async () => {
        const testMeetingData = {
            address: "4 Private Dr.",
            title: "test title",
            time: 12,
            summary: "It will be magical"
        };
        testMeeting = await addMeeting(testMeetingData);

        const testComplaintData = {
            title: "test title",
            description: "test complaint",
            status: "RESOLVED",
            meeting_id: testMeeting.meeting_id
        };
        testComplaint = await addComplaint(testComplaintData);
    });

    afterAll(async() =>{
        await deleteComplaint(testComplaint.complaint_id);
        await deleteMeeting(testMeeting.meeting_id);
    });

    test("Get All Complaints", async() => {
        const complaints = await getAllComplaints();
        expect(Array.isArray(complaints)).toBe(true);
        expect(complaints.length).toBeGreaterThan(0);
    });

    test("Get Complaint By Id", async() =>{
        const complaint = await getComplaintById(testComplaint.complaint_id);
        expect(complaint.description).toEqual(testComplaint.description);
    });

    test("Get Complaints by meeting_id", async() => {
        const complaints = await getComplaintsByMeetingId(testMeeting.meeting_id);
        expect(Array.isArray(complaints)).toBe(true);
        expect(complaints.length).toBeGreaterThan(0);
    });

    test("Get Complaints By Status", async() => {
        const complaints = await getComplaintsByStatus(testComplaint.status);
        expect(Array.isArray(complaints)).toBe(true);
        expect(complaints.length).toBeGreaterThan(0);
    });

    test("Update Complaint", async() => {
        const updateComplaintData = {
            complaint_id: testComplaint.complaint_id,
            title: "test title",
            description: "different test description",
            status: "UNREVIEWED",
            meeting_id: testComplaint.meeting_id
        };
        const updatedComplaint = await updateComplaint(testComplaint.complaint_id, updateComplaintData);
        expect(updatedComplaint.description).toBe(updateComplaintData.description);
        expect(updatedComplaint.complaint_id).toBe(testComplaint.complaint_id);
    })
});