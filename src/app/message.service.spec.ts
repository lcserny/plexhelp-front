import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { Message } from './messages/messages.model';

const STORAGE_KEY = 'notificationMessages';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
    localStorage.removeItem(STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an empty list when there are no stored messages', () => {
    expect(service.getAll()).toEqual([]);
  });

  it('should store a new message', () => {
    service.add('Something happened', 'INFO');

    expect(service.getAll()).toEqual([
      expect.objectContaining({
        message: 'Something happened',
        type: 'INFO',
        date: expect.any(String)
      })
    ]);
  });

  it('should add new messages to the front of the list', () => {
    service.add('First', 'INFO');
    service.add('Second', 'ERROR');

    expect(service.getAll().map(message => message.message)).toEqual(['Second', 'First']);
  });

  it('should read messages from localStorage', () => {
    const stored: Message[] = [
      { date: new Date('2026-01-01T00:00:00.000Z'), message: 'Stored', type: 'ERROR' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    expect(service.getAll()).toEqual([
      expect.objectContaining({ message: 'Stored', type: 'ERROR' })
    ]);
  });

  it('should clear all messages', () => {
    service.add('First', 'INFO');
    service.add('Second', 'ERROR');

    service.clear();

    expect(service.getAll()).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
  });
});
