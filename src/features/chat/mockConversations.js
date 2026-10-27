// shortcut: hard-coded sample chats kept in memory, replace with real data when 1:1 messaging gets a backend.
// A message's author is 'me' for the signed-in user, otherwise the sender's name.
const m = (author, text, time) => ({ id: crypto.randomUUID(), author, text, time })

export const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'Ayşe Yılmaz',
    messages: [m('Ayşe Yılmaz', 'Hey! How was your day?', '20:58'), m('me', 'Busy but good 😄', '21:01'), m('Ayşe Yılmaz', 'Are we still on for tonight?', '21:04')],
  },
  {
    id: '2',
    name: 'Weekend Hikers',
    isGroup: true,
    messages: [m('Elif', 'Who is in for Saturday?', '20:30'), m('me', 'Me!', '20:41'), m('Mehmet', 'I found a new trail 🌲', '20:47')],
  },
  { id: '3', name: 'Daniel Brooks', messages: [m('Daniel Brooks', 'Sent you the photos from the trip', '19:12')] },
  { id: '4', name: 'Sara Ahmadi', messages: [m('me', 'Did you see that video?', '18:28'), m('Sara Ahmadi', 'Haha that was so funny', '18:30')] },
  {
    id: '5',
    name: 'Family',
    isGroup: true,
    messages: [m('Dad', 'Who is cooking tonight?', '17:40'), m('Mom', 'Dinner at 8, don’t be late!', '17:55')],
  },
  { id: '6', name: 'Lucas Martin', messages: [m('Lucas Martin', 'Can you send me the link?', 'Yesterday')] },
  { id: '7', name: 'Design Team', isGroup: true, messages: [m('Elif', 'New mockups are up', 'Yesterday')] },
  { id: '8', name: 'Kenji Tanaka', messages: [m('me', 'Thanks for everything!', 'Mon'), m('Kenji Tanaka', 'See you next week 👋', 'Mon')] },
]
