import React, { useEffect } from "react";
import { Badge } from "react-bootstrap";
import { Announcement, Student } from "../../App";
import db from "../../firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

interface AnnouncementsProps {
    student: Student | undefined;
  }
  
  interface AnnouncementNodeProps {
    announcement: Announcement;
    student: Student | undefined;
  }
  

const Announcements: React.FC<AnnouncementsProps> = ({student }) => {
    useEffect(() => {
    });
    return (
      <div className="space-y-3 m-3">
        <h2 className="text-2xl font-bold text-center">Announcements</h2>
        {student?.announcements.map((announcement: Announcement, index: number) => (
          <AnnouncementNode announcement={announcement} student={student} key={index} />
        ))}
      </div>
    );
  };
  
  const AnnouncementNode: React.FC<AnnouncementNodeProps> = ({
    announcement,
    student
  }) => {
    async function deleteAnnouncementNode() {
      console.log("delete Announcement");
      //Delete from student?.announcements
      if (student) {
        await updateDoc(doc(db, "users", student?.docId), {
          announcements: arrayRemove({
            title: announcement.title,
            content: announcement.content,
            author: announcement.author
          })
        }).then(() => {
          // setAnnouncements(announcements.filter((el) => el.randId !== announcement.randId));
        });
      } else {
        console.log("can't find student");
      }
    };
  
    return (
      <div className="bg-white/60 rounded-2xl py-3 flex-col">
        <div className="flex items-center px-5 space-x-3">
          <p className="bg-indigo-300 rounded-full py-0.5 px-2 font-bold text-white w-fit">
            {announcement.author}
          </p>
          <div className="flex-grow"></div>
          <h4 className="font-bold text-center">{announcement.title}</h4>
          <div className="flex-grow"></div>
          <button className="bg-red-500 px-2 py-0.5 rounded-full text-white" onClick={deleteAnnouncementNode}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <h6 className="px-5 text-center">{announcement.content}</h6>
      </div>
    );
  };

  export default Announcements;
  