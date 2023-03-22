import { addMeeting, deleteMeeting, getAllMeetings, getMeetingById, Meeting, updateMeeting } from "../requests/meeting-requests"



describe('Meeting API Requests', () => {
    let testMeeting: Meeting;

    beforeAll(async () => {
        const testMeetingData = {
            address: "4 Private Dr.",
            title: "test title",
            time: 12,
            summary: "It will be magical"
        };
        testMeeting = await addMeeting(testMeetingData);
    });

    afterAll(async () => {
        await deleteMeeting(testMeeting.meeting_id);
    });

    test("Get All Meetings", async () => {
        const meetings = await getAllMeetings();
        expect(Array.isArray(meetings)).toBe(true);
        expect(meetings.length).toBeGreaterThan(0);
    });

    test("Get Meeting By Id", async () => {
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
        const updatedMeeting = await updateMeeting(testMeeting.meeting_id, updateMeetingData);
        expect(updatedMeeting.address).toBe(updateMeetingData.address);
        expect(updatedMeeting.meeting_id).toBe(testMeeting.meeting_id);
    });

});