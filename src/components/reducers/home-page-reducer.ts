import { Complaint } from "../requests/complaint-requests";
import { Meeting } from "../requests/meeting-requests";

export type ComplaintForm = {
    title: string,
    description: string,
};

export type HomeState = {
    complaintList: Complaint[],
    meetingList: Meeting[],
    complaintForm: ComplaintForm,
    showComplaintModal: boolean
};

export type Action = 
    | {type: 'setComplaintList'; payload: Complaint[]}
    | {type: 'setMeetingList'; payload: Meeting[]}
    | {type: 'resetComplaintForm'}
    | {type: 'setShowComplaintModal'; payload: boolean}
    | {type: 'setComplaintFormTitle'; payload: string}
    | {type: 'setComplaintFormDescription'; payload: string};

export const initialState: HomeState = {
    complaintList: [],
    meetingList: [],
    complaintForm:{
        title: '',
        description: ''
    },
    showComplaintModal: false
};

export function HomeReducer(state: HomeState, action: Action): HomeState{
    const nextState: HomeState = JSON.parse(JSON.stringify(state));

    switch(action.type){
        case 'setComplaintList':
            nextState.complaintList = action.payload;
            return nextState;
        case 'setMeetingList':
            nextState.meetingList = action.payload;
            return nextState;
        case 'resetComplaintForm':
            nextState.complaintForm = { title: '', description: '' };
            return nextState;
        case 'setShowComplaintModal':
            nextState.showComplaintModal = action.payload;
            return nextState;
        case 'setComplaintFormTitle':
            nextState.complaintForm.title = action.payload;
            return nextState;
        case 'setComplaintFormDescription':
            nextState.complaintForm.description = action.payload;
            return nextState;
        default:
            return state;
    }
}


