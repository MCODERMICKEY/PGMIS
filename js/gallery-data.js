// ===================================================================
// GALLERY PHOTOS & VIDEOS — edit this file to add real school media
// ===================================================================
// IMPORTANT: every line below must end with a comma "," — including
// the very last one. Forgetting a comma between two items is the #1
// reason the whole gallery can suddenly go blank, because it breaks
// this entire file. If that happens: open the browser console (press
// F12), it will point straight to the line with the mistake.
//
// HOW TO ADD A PHOTO:
//   1. Save the photo file into the images/gallery/ folder
//      (e.g. images/gallery/sports-day-2026.jpg)
//   2. Add a new line to the list below, remembering the comma at the end:
//        { type: "photo", src: "images/gallery/sports-day-2026.jpg",
//          category: "events", caption: "Sports day 2026" },
//
// HOW TO ADD A VIDEO (a file you have, e.g. an .mp4):
//   1. Save the video file into the images/gallery/ folder
//      (e.g. images/gallery/graduation-2026.mp4)
//   2. Add a new line to the list below:
//        { type: "video", src: "images/gallery/graduation-2026.mp4",
//          category: "graduation", caption: "Graduation ceremony 2026" },
//
// HOW TO ADD A VIDEO FROM YOUTUBE:
//   Any YouTube link works now — a normal "Share" link, a youtu.be
//   link, or an "Embed" link. Just paste the link you have as "embed":
//        { type: "video", embed: "https://youtu.be/VIDEO_ID",
//          category: "events", caption: "Open day highlights" },
//   or:
//        { type: "video", embed: "https://www.youtube.com/watch?v=VIDEO_ID",
//          category: "events", caption: "Open day highlights" },
//
// category must be one of: "classroom", "outdoor", "events", "materials", "graduation"
//
// TIP: after adding several items at once, refresh the gallery page.
// If it looks empty, that almost always means one line above is
// missing a comma, quote mark, or curly brace — check the console (F12).
// ===================================================================

const galleryData = [
  // Examples (delete once real photos/videos are added):
  // { type: "photo", src: "images/gallery/example.jpg", category: "classroom", caption: "Practical life corner" },
  // { type: "video", src: "images/gallery/example.mp4", category: "events", caption: "Sports day highlights" },
  // { type: "video", embed: "https://youtu.be/VIDEO_ID", category: "graduation", caption: "Graduation ceremony" },
  {type: "photo", src: "images/gallery/PECULIAR VACATION FLAYER.PNG", category: "events", caption: "Vacation ceremony"},
  {type: "video", src: "images/gallery/Dope.mp4", category: "events", caption: "Vacation cerenony"},
  {type: "video", embed: "https://www.youtube.com/embed/watch?v=t0Q2otsqC4I", category: "classroom", caption: "Entertainment"},
  {type: "photo", src: "images/gallery/Freda.jpg", category: "events", caption: "Vacation ceremony"},
  {type: "photo", src: "images/gallery/Andara.jpg", category: "events", caption: "Vacation ceremony"},
  {type: "photo", src: "images/gallery/Student_Pic_1.jpeg", category: "outdoor", caption:"Vacation"},
  {type: "photo", src: "images/gallery/Student_Pic_4.jpeg", category: "outdoor", caption:"Vacation"},
  {type: "photo", src: "images/gallery/Student_Pic_3.jpeg", category: "outdoor", caption:"Vacation"},
  {type: "photo", src: "images/gallery/Student_Pic_2.jpeg", category: "materials", caption:"Vacation"},
  {type: "photo", src: "images/gallery/Student_Pic_5.jpeg", category: "graduation", caption:"graduation"},
  {type: "video", src: "images/gallery/Ceremony_Vid_1.mp4", category: "outdoor", caption:"Vacation"},
  {type: "photo", src: "images/logo/Peculia Gift Montessori school.png", category: "materials", caption: "vacation"},
];
