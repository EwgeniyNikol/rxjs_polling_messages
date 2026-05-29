import '../css/style.css';
import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

const API_URL = 'https://rxjs-polling-messages.onrender.com/messages/unread';
const messagesBody = document.getElementById('messages-body');
const displayedIds = new Set();

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}.${month}.${year}`;
}

function truncateSubject(subject, maxLength = 15) {
    if (subject.length <= maxLength) return subject;
    return subject.slice(0, maxLength) + '...';
}

function addMessagesToTable(messages) {
    messages.forEach(message => {
        if (!displayedIds.has(message.id)) {
            displayedIds.add(message.id);
            const row = messagesBody.insertRow(0);
            row.insertCell(0).textContent = message.from;
            row.insertCell(1).textContent = truncateSubject(message.subject);
            row.insertCell(2).textContent = formatDate(message.received);
        }
    });
}

interval(10000).pipe(
    switchMap(() => ajax.getJSON(API_URL).pipe(
        map(response => response.messages),
        catchError(() => of([]))
    ))
).subscribe(messages => {
    if (messages && messages.length > 0) {
        addMessagesToTable(messages);
    }
});