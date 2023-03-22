import { Complaint } from '../requests/complaint-requests';

type AddMeetingState = {
    title: string;
    address: string;
    time: string;
    summary: string;
    selectedComplaints: number[];
    complaints: Complaint[];
};

type AddMeetingAction =
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_ADDRESS'; payload: string }
    | { type: 'SET_TIME'; payload: string }
    | { type: 'SET_SUMMARY'; payload: string }
    | { type: 'TOGGLE_COMPLAINT'; payload: Complaint }
    | { type: 'SET_COMPLAINTS'; payload: Complaint[] };

export const addMeetingReducer = (state: AddMeetingState, action: AddMeetingAction): AddMeetingState => {
    const nextState: AddMeetingState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
        case 'SET_TITLE':
            nextState.title = action.payload;
            return nextState;
        case 'SET_ADDRESS':
            nextState.address = action.payload;
            return nextState;
        case 'SET_TIME':
            nextState.time = action.payload;
            return nextState;
        case 'SET_SUMMARY':
            nextState.summary = action.payload;
            return nextState;
        case 'SET_COMPLAINTS':
            nextState.complaints = action.payload;
            return nextState;
        case 'TOGGLE_COMPLAINT': {
            const complaintId = action.payload.complaint_id;
            const isSelected = state.selectedComplaints.includes(complaintId);
            const updatedSelectedComplaints = isSelected
                ? state.selectedComplaints.filter((id) => id !== complaintId)
                : [...state.selectedComplaints, complaintId];
          
            return { ...state, selectedComplaints: updatedSelectedComplaints };
        }
        default:
            return state;
    }
};
