import { addMeeting, deleteMeeting, getAllMeetings, getMeetingById, Meeting, updateMeeting } from "../requests/meeting-requests"
import nock from "nock";


describe('Meeting API Requests', () => {
    const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual API base URL

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
    });

    afterAll(async () => {
        nock(API_BASE_URL)
            .delete(`/meetings/${testMeeting.meeting_id}`)
            .reply(200);

        await deleteMeeting(testMeeting.meeting_id);
    });

    test("Get All Meetings", async () => {
        nock(API_BASE_URL)
            .get('/meetings')
            .reply(200, [testMeeting]);

        const meetings = await getAllMeetings();
        expect(Array.isArray(meetings)).toBe(true);
        expect(meetings.length).toBeGreaterThan(0);
    });

    test("Get Meeting By Id", async () => {
        nock(API_BASE_URL)
            .get(`/meetings/${testMeeting.meeting_id}`)
            .reply(200, testMeeting);

        const meeting = await getMeetingById(testMeeting.meeting_id);
        expect(meeting.address).toEqual(testMeeting.address);
    });

    test("UpdateMeeting", async () => {
        const updateMeetingData = {
            meeting_id: testMeeting.meeting_id,
            title: "test title",
            address: "5 private drive",
            time: 10,
            summary: "Even more magical"
        };

        nock(API_BASE_URL)
            .put(`/meetings/${testMeeting.meeting_id}`)
            .reply(200, {
                ...updateMeetingData
            });

        const updatedMeeting = await updateMeeting(testMeeting.meeting_id, updateMeetingData);
        expect(updatedMeeting.address).toBe(updateMeetingData.address);
        expect(updatedMeeting.meeting_id).toBe(testMeeting.meeting_id);
    });

});