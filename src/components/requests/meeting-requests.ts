import { url } from "./url"


export type Meeting = {
    meeting_id: number,
    title: string,
    address: string,
    time: number,
    summary: string
};

export const getAllMeetings = async(): Promise<Meeting[]> => {
    const response = await fetch(`${url}/meetings`);
    const meetings = await response.json();
    return meetings;
};

export const getMeetingById = async(meeting_id: number): Promise<Meeting> => {
    const response = await fetch(`${url}/meeting/${meeting_id}`);
    const meeting = await response.json();
    return meeting;
};

export const addMeeting = async(meeting: Omit<Meeting, 'meeting_id'>): Promise<Meeting> =>{
    const response = await fetch(`${url}/meetings`, {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(meeting)
    });
    const newMeeting = await response.json();
    return newMeeting;
};

export const updateMeeting = async(meeting_id: number, meeting: Meeting): Promise<Meeting> =>{
    const response = await fetch(`${url}/meeting/${meeting_id}`, {
        method: 'PUT',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(meeting)
    });
    const updatedMeeting = await response.json();
    return updatedMeeting;
};

export const deleteMeeting = async(meeting_id: number): Promise<boolean> => {
    const response = await fetch(`${url}/meeting/${meeting_id}`, {
        method: 'DELETE', headers: { "Content-Type": "application/json"}});
    return response.ok;
}
