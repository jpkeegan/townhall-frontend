import { url } from "./url"


export type Complaint = {
    complaint_id: number,
    title: string,
    description: string,
    status: string,
    meeting_id: number
}

export const getAllComplaints = async(): Promise<Complaint[]> => {
    const response = await fetch(`${url}/complaints`);
    const complaints = await response.json();
    return complaints;
};

export const getComplaintById = async(complaint_id: number): Promise<Complaint> =>{
    const response = await fetch(`${url}/complaint/id/${complaint_id}`);
    const complaint = await response.json();
    return complaint;
};

export const getComplaintsByMeetingId = async(meeting_id: number): Promise<Complaint[]> =>{
    const response = await fetch(`${url}/complaints/meetings/${meeting_id}`);
    const complaints = await response.json();
    return complaints;
};

export const getComplaintsByStatus = async(status: string): Promise<Complaint[]> =>{
    const response = await fetch(`${url}/complaints/${status}`);
    const complaints = await response.json();
    return complaints;
};

export type addComplaintType = {
    title: string,
    description: string,
    status: string
}

export const addComplaint = async(complaint: addComplaintType): Promise<Complaint> =>{
    const response = await fetch(`${url}/complaints`, {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(complaint)
    });
    const newComplaint = await response.json();
    return newComplaint;
};

export const updateComplaint = async(complaint_id: number, complaint: Complaint): Promise<Complaint> =>{
    const response = await fetch(`${url}/complaint/${complaint_id}`, {
        method: 'PUT',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(complaint)
    });
    const updatedComplaint = await response.json();
    console.log("update response: ", updatedComplaint);
    return updatedComplaint;
};

export const deleteComplaint = async(complaint_id: number): Promise<boolean> => {
    const response = await fetch(`${url}/complaint/${complaint_id}`, {
        method: 'DELETE', headers: { "Content-Type": "application/json"}});
    return response.ok;
};
