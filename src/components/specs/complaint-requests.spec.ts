import { addComplaint, Complaint, deleteComplaint, getAllComplaints, getComplaintById, getComplaintsByMeetingId, getComplaintsByStatus, updateComplaint } from "../requests/complaint-requests"
import { addMeeting, deleteMeeting, Meeting } from "../requests/meeting-requests";
import nock from "nock";

describe('Complaint API Requests', () => {
    const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual API base URL

    let testComplaint: Complaint;
    let testMeeting: Meeting;

    beforeAll(async () => {
        const testMeetingData = {
            address: "4 Private Dr.",
            title: "test title",
            time: 12,
            summary: "It will be magical"
        };

        nock(API_BASE_URL)
            .post('/meetings')
            .reply(201, {
                meeting_id: '1',
                ...testMeetingData
            });

        testMeeting = await addMeeting(testMeetingData);

        const testComplaintData = {
            title: "test title",
            description: "test complaint",
            status: "RESOLVED",
            meeting_id: testMeeting.meeting_id
        };

        nock(API_BASE_URL)
            .post('/complaints')
            .reply(201, {
                complaint_id: '1',
                ...testComplaintData
            });

        testComplaint = await addComplaint(testComplaintData);
    });

    afterAll(async() =>{
        nock(API_BASE_URL)
            .delete(`/complaints/${testComplaint.complaint_id}`)
            .reply(200);

        nock(API_BASE_URL)
            .delete(`/meetings/${testMeeting.meeting_id}`)
            .reply(200);

        await deleteComplaint(testComplaint.complaint_id);
        await deleteMeeting(testMeeting.meeting_id);
    });

    test("Get All Complaints", async() => {
        nock(API_BASE_URL)
            .get('/complaints')
            .reply(200, [testComplaint]);

        const complaints = await getAllComplaints();
        expect(Array.isArray(complaints)).toBe(true);
        expect(complaints.length).toBeGreaterThan(0);
    });

    test("Get Complaint By Id", async() =>{
        nock(API_BASE_URL)
            .get(`/complaints/${testComplaint.complaint_id}`)
            .reply(200, testComplaint);

        const complaint = await getComplaintById(testComplaint.complaint_id);
        expect(complaint.description).toEqual(testComplaint.description);
    });

    test("Get Complaints by meeting_id", async() => {
        nock(API_BASE_URL)
            .get(`/meetings/${testMeeting.meeting_id}/complaints`)
            .reply(200, [testComplaint]);

        const complaints = await getComplaintsByMeetingId(testMeeting.meeting_id);
        expect(Array.isArray(complaints)).toBe(true);
        expect(complaints.length).toBeGreaterThan(0);
    });

    test("Get Complaints By Status", async() => {
        nock(API_BASE_URL)
            .get(`/complaints?status=${testComplaint.status}`)
            .reply(200, [testComplaint]);

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
    
        nock(API_BASE_URL)
            .put(`/complaints/${testComplaint.complaint_id}`)
            .reply(200, {
                complaint_id: testComplaint.complaint_id,
                title: updateComplaintData.title,
                description: updateComplaintData.description,
                status: updateComplaintData.status,
                meeting_id: updateComplaintData.meeting_id
            });
    
        const updatedComplaint = await updateComplaint(testComplaint.complaint_id, updateComplaintData);
        expect(updatedComplaint.description).toBe(updateComplaintData.description);
        expect(updatedComplaint.complaint_id).toBe(testComplaint.complaint_id);
    });
});