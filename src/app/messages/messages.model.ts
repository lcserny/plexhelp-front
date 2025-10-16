export interface Message {
    date: Date,
    message: string,
    type: MessageType,
}

export type MessageType = 'INFO' | 'ERROR';
